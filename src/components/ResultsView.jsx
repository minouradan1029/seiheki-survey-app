import React from 'react';
import {
  AreaChart, Area, ReferenceLine, ResponsiveContainer, Tooltip
} from 'recharts';

// ローディングスピナー
const LoadingSpinner = () => (
  <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
);

// カスタムツールチップ
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-lg">
        <p className="text-slate-700">{`${payload[0].value} 人`}</p>
      </div>
    );
  }
  return null;
};

// handleResetをpropsとして受け取る
export default function ResultsView({ results, isResultsLoading, questions, answers, handleReset }) {

  if (isResultsLoading || !results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-700">
        <LoadingSpinner />
        <p className="mt-4 text-lg">結果を分析中...</p>
      </div>
    );
  }

  const isDistributionDataValid = results.distribution && Array.isArray(results.distribution) && results.distribution.length > 0;
  const isUserScoreValid = typeof results.userScore === 'number' && !isNaN(results.userScore);
  const userScorePercentage = Math.round(results.userScore);

  return (
    <div className="min-h-screen font-sans p-4 md:p-8 text-slate-800 selection:bg-pink-500/30">
      <div className="bg-white/80 backdrop-blur-xl border border-pink-200/80 rounded-3xl shadow-2xl p-6 md:p-8 m-auto w-full max-w-6xl fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
            診断結果
          </h1>
          <p className="text-gray-600 text-lg">
            参加人数: <span className="font-bold text-slate-800">{results?.total ?? 0}</span> 人
          </p>
        </div>

        {/* あなたの性癖メジャー度 */}
        <div className="mb-12 p-6 bg-rose-50/70 rounded-2xl border border-rose-200 fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold text-center mb-2">あなたのメジャー度は？</h2>
          <p className="text-center text-gray-600 mb-6">スコアが高いほど、みんなと同じ感性の持ち主かも！</p>

          <div className="relative w-full max-w-lg mx-auto h-40 mb-4">
            {isDistributionDataValid && isUserScoreValid ? (
              <ResponsiveContainer>
                <AreaChart data={results.distribution} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="distGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  <Area type="monotone" dataKey="users" stroke="url(#distGradient)" strokeWidth={2} fill="url(#distGradient)" />
                  <ReferenceLine x={results.userScore} stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                (みんなの回答が集まるとここにグラフが出るよ)
              </div>
            )}
            {isUserScoreValid && (
              <div className="absolute top-0 text-center w-full" style={{ left: `${userScorePercentage}%`, transform: 'translateX(-50%)' }}>
                <div className="bg-violet-500 text-white font-bold px-3 py-1 rounded-md shadow-lg -mt-2">
                  {userScorePercentage}<span className="text-sm">%</span>
                </div>
                <div className="w-0.5 h-3 bg-violet-500 mx-auto mt-1"></div>
              </div>
            )}
          </div>
          <div className="flex justify-between text-sm mt-2 px-2 font-bold">
            <span className="text-pink-600">マイナー</span>
            <span className="text-orange-600">メジャー</span>
          </div>
        </div>

        {/* 各質問の結果 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {questions.map((question, index) => {
            const questionResults = results?.summary?.[question.id] || {};
            const totalVotes = Object.values(questionResults).reduce((sum, count) => sum + count, 0);
            const userChoice = answers[question.id];

            return (
              <div key={question.id} className="p-5 bg-white/60 rounded-2xl border border-gray-200/80 fade-in" style={{ animationDelay: `${200 + index * 50}ms` }}>
                <p className="font-semibold text-slate-800 mb-4">
                  <span className="text-pink-500 font-bold mr-2">Q{index + 1}.</span>
                  {question.text}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, idx) => {
                    const votes = questionResults[option] || 0;
                    const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                    const isUserChoice = option === userChoice;
                    return (
                      <div key={idx} className="relative w-full bg-gray-200/70 rounded-md p-2 overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full rounded-md transition-all duration-500 ${isUserChoice ? 'bg-pink-500/30' : 'bg-orange-500/20'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                        <div className="relative flex justify-between items-center text-sm">
                          <span className={`font-medium ${isUserChoice ? 'text-pink-700' : 'text-slate-700'}`}>{option}</span>
                          <span className={`font-bold ${isUserChoice ? 'text-pink-700' : 'text-slate-700'}`}>{votes}票 ({Math.round(percentage)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* 「もう一度診断する」ボタン */}
        <div className="text-center mt-10">
          <button
            onClick={handleReset}
            className="w-full max-w-xs bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet-300/50"
          >
            もう一度診断する
          </button>
        </div>

      </div>
    </div>
  );
}
