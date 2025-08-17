import React, { useState, useEffect } from 'react';
import { db, auth, authStateListener } from '../firebase.js';
import { collection, getDocs, query, setDoc, doc, getDoc } from "firebase/firestore";

import SurveyForm from './SurveyForm.jsx';
import SubmittedView from './SubmittedView.jsx';
import ResultsView from './ResultsView.jsx';

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  
  const [isQuestionsLoading, setIsQuestionsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [view, setView] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [isResultsLoading, setIsResultsLoading] = useState(false);
  
  const [user, setUser] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // 質問データの読み込み
  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
      })
      .catch(error => {
        console.error('質問データの読み込みに失敗しました:', error);
      })
      .finally(() => {
        setIsQuestionsLoading(false);
      });
  }, []);

  // 認証状態の監視
  useEffect(() => {
    const unsubscribe = authStateListener(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "answers", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHasSubmitted(true);
          setAnswers(docSnap.data().answers);
          setView('submitted');
        }
      } else {
        setUser(null);
      }
      setIsAuthLoading(false);
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
    if (!user || hasSubmitted) {
      console.warn("送信がブロックされました。理由:", { user: !!user, hasSubmitted });
      return;
    }

    setIsSubmitting(true);
    try {
      await setDoc(doc(db, "answers", user.uid), {
        answers: answers,
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

  // 【追加】診断をリセットして最初からやり直すための関数
  const handleReset = () => {
    setAnswers({});
    setHasSubmitted(false);
    setResults(null);
    setView('form');
  };

  if (isQuestionsLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700">
        ちょっと待ってね、準備中...
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-700 text-center p-4">
        あれれ、うまく接続できなかったみたい。<br/>もう一回ページを読み込んでみてくれる？
      </div>
    );
  }

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
      handleReset={handleReset} // 【追加】リセット関数を渡す
    />;
  }

  return <SubmittedView showResults={showResults} />;
}
