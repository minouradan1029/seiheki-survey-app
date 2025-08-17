import React from 'react';
// AreaChart, Area, ReferenceLine, Label, LabelList をインポート
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  AreaChart, Area, ReferenceLine, Label, LabelList 
} from 'recharts';

export default function ResultsView({ results, isResultsLoading, questions, answers }) {

  // isResultsLoadingがtrueの間、またはresultsオブジェクトがまだない場合はローディング画面を表示
  if (isResultsLoading || !results) {
    return (
      <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">
        結果を読み込んでいます...
      </div>
    );
  }

  // グラフ描画に必要なデータが有効かチェック
  const isDistributionDataValid = results.distribution && Array.isArray(results.distribution) && results.distribution.length > 0;
  const isUserScoreValid = typeof results.userScore === 'number' && !isNaN(results.userScore);

  return (
    <div className="bg-slate-900 min-h-screen font-sans p-4 md:p-8 text-white">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl p-6 md:p-8 m-auto w-full max-w-5xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            アンケート結果
          </h1>
          <p className="text-slate-400">
            総回答者数: {results?.total ?? 0} 人
          </p>
        </div>

        <>
          {/* ユニーク度グラフ */}
          <div className="mb-12 p-6 bg-slate-800 rounded-lg border border-slate-700">
            <h2 className="text-2xl font-bold text-center mb-4">あなたの性癖メジャー度</h2>
            <div className="w-full h-40">
              {/* データが有効な場合のみグラフを描画 */}
              {isDistributionDataValid && isUserScoreValid ? (
                <ResponsiveContainer>
                  <AreaChart data={results.distribution} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
                    <defs>
                      <linearGradient id="distGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor="#f472b6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="score" hide />
                    <YAxis hide />
                    <Tooltip
                      cursor={{ stroke: '#facc15', strokeWidth: 1, strokeDasharray: '3 3' }}
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                      labelFormatter={() => ''}
                      formatter={(value, name) => [`${value} 人`, '回答者数']}
                    />
                    <Area type="monotone" dataKey="users" stroke="#a78bfa" fill="url(#distGradient)" />
                    <ReferenceLine x={results.userScore} stroke="#facc15" strokeWidth={3}>
                      <Label value="あなたの位置" position="top" fill="#facc15" offset={10} style={{ fontWeight: 'bold' }}/>
                    </ReferenceLine>
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  (十分なデータが集まるとここに分布図が表示されます)
                </div>
              )}
            </div>
            <div className="flex justify-between text-sm mt-2 px-2">
              <span className="font-bold text-fuchsia-500">マイナー</span>
              <span className="font-bold text-cyan-400">メジャー</span>
            </div>
          </div>

          {/* 結果タイル */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {questions.map((question, index) => {
              const questionResults = results?.summary?.[question.id] || {};
              const chartData = question.options.map(option => ({
                name: option,
                votes: questionResults[option] || 0,
              }));
              const userChoice = answers[question.id];

              return (
                <div key={question.id} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700">
                  <p className="font-semibold text-slate-200 mb-4">
                    <span className="text-cyan-400 font-bold mr-2">Q{index + 1}.</span>
                    {question.text}
                  </p>
                  <div className="w-full h-48">
                    <ResponsiveContainer>
                      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={80} tick={{ fill: '#cbd5e1' }} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                        <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
                          {chartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={entry.name === userChoice ? '#f0abfc' : '#22d3ee'} />
                          ))}
                          <LabelList dataKey="votes" position="right" style={{ fill: 'white' }} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      </div>
    </div>
  );
}
