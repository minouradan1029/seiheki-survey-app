import React from 'react';

// チェックマークのSVGアイコン
const CheckIcon = () => (
  <svg className="w-16 h-16 text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
  </svg>
);

// ★★★ 変更点: handleResetを受け取るように修正 ★★★
export default function SubmittedView({ showResults, handleReset }) {
  return (
    <div className="min-h-screen font-sans flex items-center justify-center p-4 selection:bg-orange-500/30">
      <div className="bg-white/80 backdrop-blur-xl border border-orange-200/80 rounded-3xl shadow-2xl p-8 m-4 w-full max-w-lg text-center flex flex-col items-center fade-in">
        <CheckIcon />
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          おつかれさま！
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          回答をしっかり受け取りました。<br/>
          あなたの一面が、もうすぐ明らかに...！
        </p>
        <div className="w-full max-w-xs space-y-4">
          <button
            onClick={showResults}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300/50 pulse-on-ready"
          >
            みんなの結果と比べてみる
          </button>
          {/* ★★★ 追加: 「もう一度診断する」ボタンを追加 ★★★ */}
          <button
            onClick={handleReset}
            className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet-300/50"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    </div>
  );
}
