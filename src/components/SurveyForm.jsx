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
  const progressPercentage = totalQuestions > 0 ? (answeredQuestionsCount / totalQuestions) * 100 : 0;

  return (
    <div className="bg-slate-900 min-h-screen font-sans flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-8 m-4 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            深層心理アンケート
          </h1>
          <p className="text-slate-400">
            あなたの未知なる一面を探る {totalQuestions} の質問
          </p>
        </div>
        <div className="mb-8">
          <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-right text-sm text-slate-400 mt-2">{answeredQuestionsCount} / {totalQuestions} 回答済み</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {questions.map((question, index) => (
              <div key={question.id} className="p-6 bg-slate-800/60 rounded-lg border border-slate-700">
                <p className="text-lg font-semibold text-slate-200 mb-4">
                  <span className="text-fuchsia-400 font-bold mr-2">Q{index + 1}.</span>
                  {question.text}
                </p>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center p-3 rounded-md border border-slate-600 hover:bg-slate-700/50 has-[:checked]:bg-slate-700 has-[:checked]:border-fuchsia-500 cursor-pointer transition-all duration-200">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleOptionChange(question.id, option)}
                        className="sr-only"
                      />
                      <span className="ml-2 text-slate-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <button
              type="submit"
              disabled={answeredQuestionsCount < totalQuestions || isSubmitting}
              className="w-full max-w-xs bg-gradient-to-r from-fuchsia-600 to-blue-600 hover:from-fuchsia-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-fuchsia-300/50"
            >
              {isSubmitting ? '送信中...' : (answeredQuestionsCount < totalQuestions ? 'すべての質問に回答してください' : '結果を送信する')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
