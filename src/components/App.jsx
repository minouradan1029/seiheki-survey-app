import React, { useState, useEffect } from 'react';
// firebase.jsのパスはプロジェクトの構成に合わせて調整してください
import { db, authStateListener } from '../firebase.js'; 
import { collection, getDocs, query, setDoc, doc, getDoc } from "firebase/firestore";

import SurveyForm from './SurveyForm.jsx';
import SubmittedView from './SubmittedView.jsx';
import ResultsView from './ResultsView.jsx';

// --- 再利用可能なUIコンポーネント ---

// 統一感のあるローディング画面
const LoadingView = ({ text }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-slate-700 p-4">
    <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-semibold">{text}</p>
  </div>
);

// alert()の代わりにエラーを画面に表示するコンポーネント
const ErrorView = ({ message, onRetry }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-md">
      <strong className="font-bold">おっと！</strong>
      <span className="block sm:inline ml-2">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
        >
          もう一度試す
        </button>
      )}
    </div>
  </div>
);

// --- メインのAppコンポーネント ---

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [view, setView] = useState('form'); // 'form', 'submitted', 'results'
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  // ローディングとエラーの状態をまとめて管理
  const [appState, setAppState] = useState({
    isLoading: true,
    isSubmitting: false,
    isResultsLoading: false,
    error: null,
  });

  // public/questions.jsonから質問を読み込む
  useEffect(() => {
    fetch('/questions.json')
      .then(response => {
        if (!response.ok) throw new Error("質問リストが見つかりませんでした。");
        return response.json();
      })
      .then(data => {
        setQuestions(data);
      })
      .catch(error => {
        console.error('質問データの読み込みに失敗しました:', error);
        setAppState(s => ({ ...s, error: "質問データの読み込みに失敗しました。ページを再読み込みしてください。" }));
      });
  }, []);

  // 認証状態を監視し、過去の回答があるか確認
  useEffect(() => {
    const unsubscribe = authStateListener(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const docRef = doc(db, "answers", currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setHasSubmitted(true);
            setAnswers(docSnap.data().answers);
            setView('submitted');
          }
        } catch (err) {
          console.error("過去の回答の確認中にエラー:", err);
          setAppState(s => ({ ...s, error: "過去の回答を確認できませんでした。接続を確認してください。" }));
        }
      } else {
        setUser(null);
        setAppState(s => ({ ...s, error: "認証に失敗しました。もう一度ページを読み込んでください。" }));
      }
      // 認証チェックが完了したら、初期ローディング状態を解除
      setAppState(s => ({ ...s, isLoading: false }));
    });
    return () => unsubscribe(); // コンポーネントのアンマウント時に監視を解除
  }, []);

  const handleOptionChange = (questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || hasSubmitted) return;

    setAppState(s => ({ ...s, isSubmitting: true, error: null }));
    try {
      await setDoc(doc(db, "answers", user.uid), { answers });
      setHasSubmitted(true);
      setView('submitted');
    } catch (e) {
      console.error("データベースへの保存中にエラーが発生しました: ", e);
      setAppState(s => ({ ...s, error: "回答を送信できませんでした。時間をおいて再試行してください。" }));
    } finally {
      setAppState(s => ({ ...s, isSubmitting: false }));
    }
  };

  const showResults = async () => {
    setView('results');
    if (results) return; // 結果が既にあれば再取得しない

    setAppState(s => ({ ...s, isResultsLoading: true, error: null }));
    try {
      const q = query(collection(db, "answers"));
      const querySnapshot = await getDocs(q);
      
      const allAnswerSets = querySnapshot.docs.map(doc => doc.data().answers);

      // --- 結果の計算ロジック (元々のロジックを維持) ---
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
            totalAffinity += (questionResults[userAnswer] / totalVotesForQuestion) * 100;
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
      // --- 計算ロジックここまで ---

      setResults({
        summary: resultsSummary,
        total: querySnapshot.size,
        distribution: finalDistributionData,
        userScore: currentUserScore,
      });
    } catch (e) {
      console.error("結果の取得中にエラーが発生しました: ", e);
      setAppState(s => ({ ...s, error: "結果の取得に失敗しました。しばらくしてからもう一度お試しください。" }));
    } finally {
      setAppState(s => ({ ...s, isResultsLoading: false }));
    }
  };

  const handleReset = () => {
    setAnswers({});
    setHasSubmitted(false);
    setResults(null);
    setView('form');
    setAppState(s => ({ ...s, error: null }));
  };
  
  // --- 表示ロジック ---

  if (appState.isLoading || questions.length === 0) {
    return <LoadingView text="診断の準備をしています..." />;
  }

  if (appState.error) {
    return <ErrorView message={appState.error} />;
  }
  
  if (!user) {
     return <ErrorView message="ユーザー情報の取得に失敗しました。ページを再読み込みしてください。" />;
  }

  // --- 表示する画面の切り替え ---
  const renderView = () => {
    switch (view) {
      case 'results':
        return <ResultsView 
          results={results} 
          isResultsLoading={appState.isResultsLoading}
          questions={questions}
          answers={answers}
          handleReset={handleReset}
        />;
      case 'submitted':
        return <SubmittedView showResults={showResults} />;
      case 'form':
      default:
        return <SurveyForm 
          questions={questions}
          answers={answers}
          handleOptionChange={handleOptionChange}
          handleSubmit={handleSubmit}
          isSubmitting={appState.isSubmitting}
          submissionError={appState.error}
        />;
    }
  };

  return (
    <main>
      {renderView()}
    </main>
  );
}
