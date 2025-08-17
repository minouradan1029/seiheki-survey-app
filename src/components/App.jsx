import React, { useState, useEffect } from 'react';
import { db } from '../firebase.js';
import { collection, addDoc, getDocs, query } from "firebase/firestore";

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

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('質問データの読み込みに失敗しました:', error);
        setIsLoading(false);
      });
  }, []);

  const handleOptionChange = (questionId, option) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: option,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "answers"), {
        answers: answers,
        submittedAt: new Date(),
      });
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

      // 1. 全回答の選択肢ごとの数を集計
      const resultsSummary = {};
      allAnswerSets.forEach(singleAnswerSet => {
        for (const questionId in singleAnswerSet) {
          const answerValue = singleAnswerSet[questionId];
          if (!resultsSummary[questionId]) resultsSummary[questionId] = {};
          if (!resultsSummary[questionId][answerValue]) resultsSummary[questionId][answerValue] = 0;
          resultsSummary[questionId][answerValue]++;
        }
      });

      // 2. 各ユーザーの「メジャー度」スコアを計算する関数
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
            totalAffinity += percentage; // 多数派の回答ほど高い値が加算される
          }
        });
        return totalAffinity / questionIds.length;
      };

      // 3. 全ユーザーのスコアを計算
      const allScores = allAnswerSets.map(ans => calculateMajorityScore(ans));
      const currentUserScore = calculateMajorityScore(answers);

      // 4. スコアの分布データを作成
      const distributionBuckets = 20; // グラフの滑らかさ
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

  if (view === 'results') {
    return <ResultsView 
      results={results} 
      isResultsLoading={isResultsLoading}
      questions={questions}
      answers={answers}
    />;
  }

  if (view === 'submitted') {
    return <SubmittedView showResults={showResults} />;
  }

  return <SurveyForm 
    questions={questions}
    answers={answers}
    handleOptionChange={handleOptionChange}
    handleSubmit={handleSubmit}
    isSubmitting={isSubmitting}
  />;
}
