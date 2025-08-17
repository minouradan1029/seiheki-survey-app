import React, { useRef, useEffect } from 'react';

export default function SurveyForm({
  questions,
  answers,
  handleOptionChange,
  handleSubmit,
  isSubmitting,
  submissionError // 送信エラーを表示するための新しいprop
}) {
  const answeredQuestionsCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const isAllAnswered = answeredQuestionsCount === totalQuestions;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestionsCount / totalQuestions) * 100 : 0;

  // 各質問要素への参照を保持するためのref
  const questionRefs = useRef([]);

  // questions配列が変更されたときに、ref配列のサイズを同期させる
  useEffect(() => {
    questionRefs.current = questionRefs.current.slice(0, questions.length);
  }, [questions]);

  // 回答選択時の処理
  const handleSelection = (questionId, option, index) => {
    // Appコンポーネントのstateを更新
    handleOptionChange(questionId, option);

    // 次の質問へスムーズにスクロール
    const nextQuestionIndex = index + 1;
    if (nextQuestionIndex < questions.length) {
      // チェックマークのアニメーション(0.3s)が終わるのを待ってからスクロールを開始
      setTimeout(() => {
        // --- ▼▼▼ここから変更▼▼▼ ---
        // behavior: 'smooth' を削除し、CSSのアニメーションに任せる
        questionRefs.current[nextQuestionIndex]?.scrollIntoView({
          block: 'center', // 画面の中央に表示されるように
        });
        // --- ▲▲▲ここまで変更▲▲▲ ---
      }, 350);
    }
  };


  return (
    // メインコンテナ: justify-centerを削除し、padding-topを調整
    <div className="min-h-screen font-sans flex flex-col items-center p-4 pt-12 selection:bg-pink-500/30">
      {/* 背景、ぼかし、ボーダー、影を持つカード要素 */}
      <div className="bg-white/80 backdrop-blur-xl border border-pink-200/80 rounded-3xl shadow-2xl w-full max-w-3xl fade-in">
        
        {/* ヘッダーとプログレスバーを画面上部に固定 */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg rounded-t-3xl pt-6 pb-4 mb-4 md:pt-8 md:pb-6">
          <div className="px-6 md:px-8">
            {/* ヘッダー */}
            <header className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
                性癖まるわかり診断
              </h1>
              <p className="text-gray-600">
                あなたのすべてをさらけ出す、{totalQuestions}個の質問。
              </p>
            </header>

            {/* プログレスバー */}
            <div className="px-2">
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-medium text-gray-500">進捗</span>
                <span className="text-sm font-bold bg-rose-100 text-pink-600 px-2 py-0.5 rounded-full">{answeredQuestionsCount} / {totalQuestions}</span>
              </div>
              <div className="w-full bg-gray-200/80 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-400 to-orange-400 h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>


        {/* フォーム */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 pt-0 md:pt-0">
          <div className="space-y-6">
            {questions.map((question, index) => (
              // 各質問にrefを設定
              <div 
                key={question.id} 
                ref={el => questionRefs.current[index] = el}
                className="p-5 bg-white/60 rounded-2xl border border-gray-200/80 transition-all duration-300 hover:border-pink-400/50 hover:shadow-md fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <p className="text-lg font-semibold text-slate-800 mb-4">
                  <span className="text-pink-500 font-bold mr-2">Q{index + 1}.</span>
                  {question.text}
                </p>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:bg-rose-50/70 has-[:checked]:border-pink-500 has-[:checked]:bg-pink-500/10 cursor-pointer transition-all duration-200 transform has-[:checked]:scale-[1.02]">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        // onChangeイベントで新しい関数を呼び出す
                        onChange={() => handleSelection(question.id, option, index)}
                        className="sr-only"
                      />
                      <span className="w-5 h-5 min-w-5 rounded-full border-2 border-gray-400 flex items-center justify-center mr-3 transition-all duration-200">
                        {answers[question.id] === option && <span className="w-2.5 h-2.5 rounded-full bg-pink-500 checkmark-pop"></span>}
                      </span>
                      <span className="text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 送信エリア */}
          <div className="text-center mt-10">
            {/* 送信エラーが存在すれば表示 */}
            {submissionError && (
              <p className="text-red-600 mb-4 font-semibold">{submissionError}</p>
            )}
            <button
              type="submit"
              disabled={!isAllAnswered || isSubmitting}
              className={`w-full max-w-xs text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300/50 disabled:opacity-50 disabled:cursor-not-allowed
                ${isSubmitting ? 'bg-gray-400' : 'bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 hover:scale-105'}
                ${isAllAnswered && !isSubmitting ? 'pulse-on-ready' : ''}
              `}
            >
              {isSubmitting ? '診断中...' : (isAllAnswered ? '診断する！' : '全部答えてね！')}
            </button>
          </div>
        </form>
      </div>
      {/* 著作権表示と広告スペース確保のためのフッターを追加 */}
      <footer className="text-center p-4 mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 性癖まるわかり診断. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
