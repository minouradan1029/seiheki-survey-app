import React, { useState, useEffect, useCallback } from 'react';
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
const ErrorView = ({ message }) => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-md">
      <strong className="font-bold">おっと！</strong>
      <span className="block sm:inline ml-2">{message}</span>
    </div>
  </div>
);

// --- メインのAppコンポーネント ---

export default function App() {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const [answers, setAnswers] = useState({}); // 現在のユーザーの回答
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [results, setResults] = useState(null); // 表示用の結果データ
  const [view, setView] = useState('loading'); // 'loading', 'form', 'submitted', 'results', 'error'
  
  const [appState, setAppState] = useState({
    isSubmitting: false,
    isResultsLoading: false,
    error: null,
  });

  // 質問リストの読み込み (変更なし)
  useEffect(() => {
    fetch('/questions.json')
      .then(response => {
        if (!response.ok) throw new Error("質問リストが見つかりませんでした。");
        return response.json();
      })
      .then(data => setQuestions(data))
      .catch(error => {
        console.error('質問データの読み込みに失敗しました:', error);
        setAppState(s => ({ ...s, error: "質問データの読み込みに失敗しました。" }));
        setView('error');
      });
  }, []);

  // ★★★ 変更点: アプリのモードをURLに応じて決定 ★★★
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resultId = urlParams.get('resultId');

    if (resultId) {
      // --- 共有結果表示モード ---
      // 閲覧者が誰であるかを確認するために認証状態を監視
      authStateListener(currentUser => setUser(currentUser));
      // 指定されたIDの結果を読み込む
      loadResults(resultId);
    } else {
      // --- 通常の診断モード ---
      const unsubscribe = authStateListener(async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          try {
            const docRef = doc(db, "answers", currentUser.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setAnswers(docSnap.data().answers);
              setHasSubmitted(true);
              setView('submitted');
            } else {
              setHasSubmitted(false);
              setView('form');
            }
          } catch (err) {
            console.error("過去の回答の確認中にエラー:", err);
            setAppState(s => ({ ...s, error: "過去の回答を確認できませんでした。" }));
            setView('error');
          }
        } else {
          setAppState(s => ({ ...s, error: "認証に失敗しました。ページを再読み込みしてください。" }));
          setView('error');
        }
      });
      return () => unsubscribe();
    }
  }, []); // このuseEffectは初回読み込み時に一度だけ実行されます

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
      setAppState(s => ({ ...s, error: "回答を送信できませんでした。" }));
    } finally {
      setAppState(s => ({ ...s, isSubmitting: false }));
    }
  };

  // ★★★ 変更点: どのユーザーの結果でも読み込めるように汎用化 ★★★
  const loadResults = useCallback(async (userId) => {
    if (!userId) {
      setAppState(s => ({ ...s, error: "ユーザーIDが指定されていません。" }));
      setView('error');
      return;
    }

    setView('results');
    setAppState(s => ({ ...s, isResultsLoading: true, error: null }));

    try {
      // 全員の回答を統計データのために取得
      const allAnswersQuery = query(collection(db, "answers"));
      const querySnapshot = await getDocs(allAnswersQuery);
      const allAnswerSets = querySnapshot.docs.map(doc => doc.data().answers);

      // 特定のユーザーの回答を取得
      const targetUserAnswersRef = doc(db, "answers", userId);
      const targetUserAnswersSnap = await getDoc(targetUserAnswersRef);
      if (!targetUserAnswersSnap.exists()) {
        throw new Error("指定された診断結果が見つかりませんでした。");
      }
      const targetUserAnswers = targetUserAnswersSnap.data().answers;

      // --- 結果の計算ロジック (変更なし) ---
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
      const targetUserScore = calculateMajorityScore(targetUserAnswers);
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
        userScore: targetUserScore,
        displayedAnswers: targetUserAnswers,
        displayedUserId: userId,
      });
    } catch (e) {
      console.error("結果の取得中にエラーが発生しました: ", e);
      setAppState(s => ({ ...s, error: e.message || "結果の取得に失敗しました。" }));
    } finally {
      setAppState(s => ({ ...s, isResultsLoading: false }));
    }
  }, []);

  // ★★★ 変更点: トップページに戻って診断をやり直すように変更 ★★★
  const handleReset = () => {
    window.location.href = window.location.origin;
  };

  // --- 表示ロジック ---
  const renderView = () => {
    if (view === 'loading' || (view === 'form' && questions.length === 0)) {
      return <LoadingView text="診断の準備をしています..." />;
    }
    if (appState.error) {
      return <ErrorView message={appState.error} />;
    }

    switch (view) {
      case 'results':
        return <ResultsView 
          results={results} 
          isResultsLoading={appState.isResultsLoading}
          questions={questions}
          answers={results?.displayedAnswers || {}} // resultsオブジェクト内の回答を使用
          handleReset={handleReset}
          currentUserId={user?.uid} // 現在のユーザーIDを渡す
          displayedUserId={results?.displayedUserId} // 表示されている結果のユーザーIDを渡す
        />;
      case 'submitted':
        return <SubmittedView showResults={() => loadResults(user.uid)} />;
      case 'form':
        return <SurveyForm 
          questions={questions}
          answers={answers}
          handleOptionChange={handleOptionChange}
          handleSubmit={handleSubmit}
          isSubmitting={appState.isSubmitting}
          submissionError={appState.error}
        />;
      default:
        return <ErrorView message={appState.error || "予期せぬエラーが発生しました。"} />;
    }
  };

  return <main>{renderView()}</main>;
}
