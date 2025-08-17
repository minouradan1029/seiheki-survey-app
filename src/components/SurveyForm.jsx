import React from 'react';

export default function SurveyForm({
  questions,
  answers,
  handleOptionChange,
  handleSubmit,
  isSubmitting
}) {
  const answeredQuestionsCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const isAllAnswered = answeredQuestionsCount === totalQuestions;
  const progressPercentage = totalQuestions > 0 ? (answeredQuestionsCount / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen font-sans flex items-center justify-center p-4 selection:bg-pink-500/30">
      <div className="bg-white/80 backdrop-blur-xl border border-pink-200/80 rounded-3xl shadow-2xl p-6 md:p-8 m-4 w-full max-w-3xl fade-in">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
            性癖まるわかり診断
          </h1>
          <p className="text-gray-600">
            まだ知らない自分に出会う、{totalQuestions}個の質問
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8 px-2">
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-medium text-gray-500">いまここ</span>
            <span className="text-sm font-bold bg-rose-100 text-pink-600 px-2 py-0.5 rounded-full">{answeredQuestionsCount} / {totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200/80 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-400 to-orange-400 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* フォーム本体 */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="p-5 bg-white/60 rounded-2xl border border-gray-200/80 transition-all duration-300 hover:border-pink-400/50 fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <p className="text-lg font-semibold text-slate-800 mb-4">
                  <span className="text-pink-500 font-bold mr-2">Q{index + 1}.</span>
                  {question.text}
                </p>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:bg-rose-50/70 has-[:checked]:border-pink-500 has-[:checked]:bg-pink-500/10 cursor-pointer transition-all duration-200">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleOptionChange(question.id, option)}
                        className="sr-only"
                      />
                      <span className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center mr-3 transition-all duration-200">
                        {answers[question.id] === option && <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>}
                      </span>
                      <span className="text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 送信ボタン */}
          <div className="text-center mt-10">
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
    </div>
  );
}
