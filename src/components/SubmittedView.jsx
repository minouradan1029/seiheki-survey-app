import React from 'react';

export default function SubmittedView({ showResults }) {
  return (
    <div className="bg-slate-900 min-h-screen font-sans flex items-center justify-center p-4">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-fuchsia-500/30 rounded-2xl shadow-2xl p-8 m-4 w-full max-w-2xl text-center">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          ご回答ありがとうございました
        </h2>
        <p className="text-slate-300 mb-8">
          あなたの回答は正常に記録されました。
        </p>
        <button
          onClick={showResults}
          className="w-full max-w-xs bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300/50"
        >
          みんなの結果を見る
        </button>
      </div>
    </div>
  );
}
