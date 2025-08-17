import React from 'react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip
} from 'recharts';

// --- アイコンコンポーネント群 ---

const LoadingSpinner = () => (
  <div className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
);

const ShareIconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const ShareIconLine = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M16.48,8.321a1.043,1.043,0,0,0-1.033,1.054v.172a.87.87,0,0,1-.266.658,1.033,1.033,0,0,1-.759.29h-3.2a.3.3,0,0,0-.3.3v3.2a.3.3,0,0,0,.3.3h3.2a1.043,1.043,0,0,1,1.033,1.054v.172a.87.87,0,0,1-.266.658,1.033,1.033,0,0,1-.759.29H7.833a.3.3,0,0,0-.3.3v3.2a.3.3,0,0,0,.3.3h8.646a4.521,4.521,0,0,0,4.521-4.521V12.842A4.521,4.521,0,0,0,16.48,8.321ZM7.521,8.321a4.521,4.521,0,0,0-4.521,4.521v4.479a.3.3,0,0,0,.3.3H7.521a1.043,1.043,0,0,1,1.033-1.054V16.4a.87.87,0,0,1,.266-.658,1.033,1.033,0,0,1,.759-.29h3.2a.3.3,0,0,0,.3-.3v-3.2a.3.3,0,0,0-.3-.3H9.579a1.043,1.043,0,0,1-1.033-1.054V9.375a.87.87,0,0,1-.266-.658,1.033,1.033,0,0,1-.759-.29Z" />
    </svg>
);

// ★★★ 新しいアイコンを追加 ★★★
const ShareIconFacebook = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.878C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

const ShareIconDiscord = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d="M20.317 4.3698a19.7913 19.7913 0 0 0-4.8851-1.5152.0741.0741 0 0 0-.0785.0371c-.211.3753-.4464.8245-.6667 1.2652-1.9905-.6112-4.0787-.6112-6.0454 0-.2203-.4407-.4557-.8899-.6667-1.2652a.0741.0741 0 0 0-.0785-.0371 19.7913 19.7913 0 0 0-4.8851 1.5152.069.069 0 0 0-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 0 0 .0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 0 0 .0842-.0276c.4616-.5763.8756-1.2247 1.2246-1.933.0116-.0228.004-.0498-.0127-.0687-1.429-.8874-2.7734-2.0009-4.0407-3.2536a.0724.0724 0 0 1-.004-.1019c.126-.21.262-.415.4015-.6155a.0724.0724 0 0 1 .0785-.0099c.9533.5536 1.9538 1.0329 2.9912 1.43a.0741.0741 0 0 0 .0871-.004c.3283-.204.6393-.427.929-.6639a.0741.0741 0 0 0 .0128-.094c-.2203-.2756-.4406-.5512-.6478-.8465a.0741.0741 0 0 1 .021-.1028c1.6932-1.0328 3.284-2.3446 4.6408-3.8188a.0741.0741 0 0 1 .099-.0128c.12.083.239.166.358.249.0741.05.16.0187.1952-.0418.22-.3853.4194-.7806.5982-1.1857a.0741.0741 0 0 0-.004-.0823c-.3488-.298-.717-.5762-1.0954-.8348a.0741.0741 0 0 1-.0128-.094c.2898-.236.5665-.4819.8304-.737a.0741.0741 0 0 0 .0871-.004c1.0374.3971 2.0379.8764 2.9912 1.43a.0724.0724 0 0 1 .0785.0099c.1395.2.2755.4055.4015.6155a.0724.0724 0 0 1-.004.1019c-1.2673 1.2527-2.6117 2.3662-4.0407 3.2536a.0741.0741 0 0 0-.0127.0687c.349.7083.763 1.3567 1.2246 1.933a.0777.0777 0 0 0 .0842.0276c1.9516-.6067 3.9399-1.5218 5.9929-3.0294a.0824.0824 0 0 0 .0312-.0561c.4182-4.478-.834-9.012-3.2524-13.6502a.069.069 0 0 0-.0321-.0277z" />
    </svg>
);

const CopyIcon = ({ IconComponent }) => (
    <div className="relative w-6 h-6">
        <IconComponent />
    </div>
);

// --- 結果画面のためのヘルパーコンポーネント ---

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-3 rounded-lg border border-gray-200 shadow-lg">
        <p className="text-slate-700 font-semibold">{`${payload[0].value} 人`}</p>
      </div>
    );
  }
  return null;
};

// --- メインの結果表示コンポーネント ---

export default function ResultsView({ results, isResultsLoading, questions, answers, handleReset }) {

  const [copySuccess, setCopySuccess] = React.useState('');

  // ローディング状態の表示
  if (isResultsLoading || !results) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-700">
        <LoadingSpinner />
        <p className="mt-4 text-lg font-semibold">結果を分析中...</p>
      </div>
    );
  }

  const isDistributionDataValid = results.distribution && Array.isArray(results.distribution) && results.distribution.length > 0;
  const isUserScoreValid = typeof results.userScore === 'number' && !isNaN(results.userScore);
  const userScorePercentage = Math.round(results.userScore);

  const getShareText = (score) => {
    // スコアに応じたコメント部分を定義します
    let comment;
    if (score <= 10) {
      comment = `完全に少数派の嗜好。研究者に標本として狙われそうなレベルです...同族を探してます。`;
    } else if (score <= 20) {
      comment = `かなりニッチな領域に足を踏み入れてますね。理解者を見つけるのは至難の業かも。`;
    } else if (score <= 30) {
      comment = `一般的ではない嗜好をお持ちのようで。でもそこが味わい深いところなのでは？`;
    } else if (score <= 40) {
      comment = `少し人と違った感性の持ち主。それが個性というものかもしれない。`;
    } else if (score <= 50) {
      comment = `中間地点。王道も通るし、時には脇道も楽しむバランス型ですね。`;
    } else if (score <= 60) {
      comment = `やや主流寄りの嗜好。多くの人と話が合いそうで何より。`;
    } else if (score <= 70) {
      comment = `結構メジャーな路線。飲み会での話題に困らなそうです。`;
    } else if (score <= 80) {
      comment = `王道を歩む安定派。みんなが頷く、間違いのない選択眼です。`;
    } else if (score <= 90) {
      comment = `定番中の定番。辞書の「一般的」の項目に載りそうなレベルです。`;
    } else {
      comment = `もはやテンプレート級のメジャー嗜好。これ以上ないほどの王道を征く。`;
    }

    // シェアするテキストの各要素を定義します
    const resultLine = `私の性癖メジャー度は【${score}%】でした！`;
    const hashtagLine = `#性癖まるわかり診断`;

    // 見やすさを考慮して空行(\n\n)で各要素を区切って組み立てます
    return `${resultLine}\n\n${comment}\n\n${hashtagLine}`;
  };

  const shareText = getShareText(userScorePercentage);
  const shareUrl = window.location.href;

  // Twitter用のシェアURL。textに生成した文章、urlにページのURLを指定します
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  
  // LINE用のシェアURL。URLもメッセージに含め、空行を入れて見やすくします
  const lineShareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(shareText + "\n\n" + shareUrl)}`;

  // Facebook用のシェアURL。uにURL、quoteに文章を指定します
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;

  // クリップボードにコピーする関数
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(type);
      setTimeout(() => setCopySuccess(''), 2000);
    }, (err) => {
      console.error('クリップボードへのコピーに失敗しました', err);
      alert('コピーに失敗しました。');
    });
  };

  return (
    <div className="min-h-screen font-sans p-4 py-12 md:p-8 md:py-16 text-slate-800 selection:bg-pink-500/30">
      <div className="bg-white/80 backdrop-blur-xl border border-pink-200/80 rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-4xl mx-auto fade-in">
        
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-orange-400 bg-clip-text text-transparent">
            診断結果
          </h1>
          <p className="text-gray-600 text-lg">
            現在の総参加人数: <span className="font-bold text-slate-800">{results?.total ?? 0}</span> 人
          </p>
        </header>

        <section className="mb-12 p-6 bg-rose-50/70 rounded-2xl border border-rose-200 fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-2xl font-bold text-center mb-2 text-slate-800">あなたの性癖メジャー度</h2>
          <p className="text-center text-gray-600 mb-6 leading-relaxed">
            あなたの回答が、みんなとどれくらい同じだったかをパーセントで示します。<br className="hidden md:block" />
            スコアが高いほど、あなたは多数派（メジャー）な感性の持ち主かもしれません。
          </p>

          <div className="relative w-full max-w-2xl mx-auto h-52 mb-4">
            {isDistributionDataValid && isUserScoreValid ? (
              <ResponsiveContainer>
                <AreaChart data={results.distribution} margin={{ top: 30, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="distGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--accent-color)', strokeWidth: 1, strokeDasharray: '3 3' }} />
                  <Area type="monotone" dataKey="users" stroke="url(#distGradient)" strokeWidth={2} fill="url(#distGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                (みんなの回答が集まるとここにグラフが表示されます)
              </div>
            )}
            {isUserScoreValid && (
              <div className="absolute top-0 text-center" style={{ left: `${userScorePercentage}%`, transform: 'translateX(-50%)', zIndex: 10, pointerEvents: 'none' }}>
                <div className="inline-block bg-violet-500 text-white font-bold px-3 py-1 rounded-md shadow-lg -mt-2" style={{ pointerEvents: 'auto' }}>
                  あなたのスコア: {userScorePercentage}<span className="text-sm">%</span>
                </div>
                <div className="w-0.5 h-44 bg-violet-500 mx-auto"></div>
              </div>
            )}
          </div>
          <div className="flex justify-between text-sm mt-2 px-2 font-bold">
            <span className="text-pink-600">← マイナー (個性的)</span>
            <span className="text-orange-600">(多数派) メジャー →</span>
          </div>
        </section>

        <div className="h-12 md:h-16"></div>

        {/* ★★★ シェアセクションを大幅に改良 ★★★ */}
        <section className="text-center mb-12 fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-lg font-bold text-slate-700 mb-2">結果をシェアして友達と比べよう！</h3>
            <p className="text-gray-600 mb-6">{getShareText(userScorePercentage).split('\n')[1]}</p>
            
            <div className="flex justify-center items-center flex-wrap gap-4">
                <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-16 h-16 bg-black rounded-full shadow-lg transform transition-transform hover:scale-110" aria-label="Share on X">
                    <ShareIconX />
                </a>
                <a href={lineShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full shadow-lg transform transition-transform hover:scale-110" aria-label="Share on Line">
                    <ShareIconLine />
                </a>
                <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full shadow-lg transform transition-transform hover:scale-110" aria-label="Share on Facebook">
                    <ShareIconFacebook />
                </a>
            </div>
            <div className="mt-6 flex justify-center flex-wrap gap-4">
                <button onClick={() => copyToClipboard(shareText, 'text')} className="relative bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
                  {copySuccess === 'text' ? 'コピーしました！' : 'テキストをコピー'}
                </button>
                <button onClick={() => copyToClipboard(shareUrl, 'url')} className="relative bg-gray-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
                  {copySuccess === 'url' ? 'コピーしました！' : 'リンクをコピー'}
                </button>
            </div>
        </section>

        <div className="h-12 md:h-16"></div>

        <section>
          <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">みんなの回答の内訳</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {questions.map((question, index) => {
              const questionResults = results?.summary?.[question.id] || {};
              const totalVotes = Object.values(questionResults).reduce((sum, count) => sum + count, 0);
              const userChoice = answers[question.id];

              return (
                <div key={question.id} className="p-5 bg-white/60 rounded-2xl border border-gray-200/80 fade-in" style={{ animationDelay: `${300 + index * 50}ms` }}>
                  <p className="font-semibold text-slate-800 mb-4 leading-relaxed">
                    <span className="text-pink-500 font-bold mr-2">Q{index + 1}.</span>
                    {question.text}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, idx) => {
                      const votes = questionResults[option] || 0;
                      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
                      const isUserChoice = option === userChoice;
                      return (
                        <div key={idx} className={`relative w-full bg-gray-200/70 rounded-md p-2 overflow-hidden border-2 ${isUserChoice ? 'border-pink-400' : 'border-transparent'}`}>
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-300 to-pink-300 opacity-50 transition-all duration-500"
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
        </section>

      </div>

      <footer className="text-center p-4 mt-12">
        <button
          onClick={handleReset}
          className="w-full max-w-xs bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-violet-300/50"
        >
          もう一度診断する
        </button>
        <p className="mt-8 text-gray-500 text-sm">&copy; 2024 性癖まるわかり診断. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
