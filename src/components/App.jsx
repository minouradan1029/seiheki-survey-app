import React, { useState, useEffect } from 'react';
// firebase.js から auth と authStateListener をインポート
import { db, auth, authStateListener } from '../firebase.js';
// setDoc, doc, getDoc をインポート
import { collection, getDocs, query, setDoc, doc, getDoc } from "firebase/firestore";

import SurveyForm from './SurveyForm.jsx';
import SubmittedView from './SubmittedView.jsx';
import ResultsView from './ResultsView.jsx';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  
  // 認証ユーザーと回答済みかの状態を管理
  const [user, setUser] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // 質問データの読み込み
  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        // 認証状態のチェックが終わるまでローディングを継続
      })
      .catch(error => {
        console.error('質問データの読み込みに失敗しました:', error);
        setIsLoading(false);
      });
  }, []);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = authStateListener(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // このユーザーが既に回答済みか確認
        const docRef = doc(db, "answers", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHasSubmitted(true);
          // ユーザー自身の回答を読み込む
          setAnswers(docSnap.data().answers);
          setView('submitted'); // 回答済みの場合はSubmittedViewを表示
        }
      } else {
        setUser(null);
      }
      // 認証チェックと質問読み込みが終わったらローディング完了
      setIsLoading(false);
    });
    return () => unsubscribe(); // クリーンアップ
  }, []);


  const handleOptionChange = (questionId, option) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // ユーザーがいない、または回答済みの場合は送信しない
    if (!user || hasSubmitted) return;

    setIsSubmitting(true);
    try {
      // ドキュメントIDとしてユーザーの匿名UIDを使用
      await setDoc(doc(db, "answers", user.uid), {
        answers: answers,
        // submittedAt: new Date(), // ★特定につながる可能性があるため削除
      });
      setHasSubmitted(true);
      setView('submitted');
    } catch (e) {
      console.error("データベースへの保存中にエラーが発生しました: ", e);
      alert("エラーが発生しました。回答を送信できませんでした。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showResults = async () => {
    setView('results');
    setIsResultsLoading(true);
    try {
      const q = query(collection(db, "answers"));
      const querySnapshot = await getDocs(q);
      
      const allAnswerSets = [];
      querySnapshot.forEach(doc => allAnswerSets.push(doc.data().answers));

      const resultsSummary = {};
      allAnswerSets.forEach(singleAnswerSet => {
        for (const questionId in singleAnswerSet) {
          const answerValue = singleAnswerSet[questionId];
          if (!resultsSummary[questionId]) resultsSummary[questionId] = {};
          if (!resultsSummary[questionId][answerValue]) resultsSummary[questionId][answerValue] = 0;
          resultsSummary[questionId][answerValue]++;
        }
      });

      const calculateMajorityScore = (userAnswers) => {
        let totalAffinity = 0;
        const questionIds = Object.keys(userAnswers);
        if (questionIds.length === 0) return 50;

        questionIds.forEach(qId => {
          const userAnswer = userAnswers[qId];
          const questionResults = resultsSummary[qId];
          const totalVotesForQuestion = Object.values(questionResults || {}).reduce((sum, count) => sum + count, 0);

          if (questionResults && questionResults[userAnswer] && totalVotesForQuestion > 0) {
            const percentage = (questionResults[userAnswer] / totalVotesForQuestion) * 100;
            totalAffinity += percentage;
          }
        });
        return totalAffinity / questionIds.length;
      };

      const allScores = allAnswerSets.map(ans => calculateMajorityScore(ans));
      const currentUserScore = calculateMajorityScore(answers);

      const distributionBuckets = 20;
      const distributionData = Array(distributionBuckets).fill(0).map((_, i) => ({
        score: (i + 0.5) * (100 / distributionBuckets),
        users: 0
      }));
      allScores.forEach(score => {
        const bucketIndex = Math.min(Math.floor(score / (100 / distributionBuckets)), distributionBuckets - 1);
        distributionData[bucketIndex].users++;
      });
      const finalDistributionData = [
        { score: 0, users: 0 },
        ...distributionData,
        { score: 100, users: 0 }
      ];

      setResults({
        summary: resultsSummary,
        total: querySnapshot.size,
        distribution: finalDistributionData,
        userScore: currentUserScore
      });

    } catch (e) {
      console.error("結果の取得中にエラーが発生しました: ", e);
      alert("結果の取得に失敗しました。");
    } finally {
      setIsResultsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
        データを読み込んでいます...
      </div>
    );
  }
  
  // SurveyFormにhasSubmittedプロパティを渡す
  if (view === 'form' && !hasSubmitted) {
     return <SurveyForm 
      questions={questions}
      answers={answers}
      handleOptionChange={handleOptionChange}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />;
  }

  if (view === 'results') {
    return <ResultsView 
      results={results} 
      isResultsLoading={isResultsLoading}
      questions={questions}
      answers={answers}
    />;
  }

  // submitted or form (when hasSubmitted is true)
  return <SubmittedView showResults={showResults} />;
}