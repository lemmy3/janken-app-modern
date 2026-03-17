'use client';

import { useState } from 'react';

type Hand = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw';

const handEmojis = { rock: '✊', paper: '✋', scissors: '✌️' };
const handNames = { rock: 'グー', paper: 'パー', scissors: 'チョキ' };

export default function Home() {
  const [playerHand, setPlayerHand] = useState<Hand | null>(null);
  const [cpuHand, setCpuHand] = useState<Hand | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [score, setScore] = useState({ win: 0, lose: 0, draw: 0 });
  const [cpuThinking, setCpuThinking] = useState(false);

  const getRandomHand = (): Hand => {
    const hands: Hand[] = ['rock', 'paper', 'scissors'];
    return hands[Math.floor(Math.random() * 3)];
  };

  const judge = (player: Hand, cpu: Hand): Result => {
    if (player === cpu) return 'draw';
    const rules: Record<Hand, Hand> = { rock: 'scissors', scissors: 'paper', paper: 'rock' };
    return rules[player] === cpu ? 'win' : 'lose';
  };

  const play = (hand: Hand) => {
    if (cpuThinking) return;
    
    setPlayerHand(hand);
    setCpuThinking(true);
    
    setTimeout(() => {
      const cpu = getRandomHand();
      const result = judge(hand, cpu);
      
      setCpuHand(cpu);
      setResult(result);
      setCpuThinking(false);
      
      setScore(prev => ({
        win: result === 'win' ? prev.win + 1 : prev.win,
        lose: result === 'lose' ? prev.lose + 1 : prev.lose,
        draw: result === 'draw' ? prev.draw + 1 : prev.draw
      }));
    }, 800);
  };

  const resetGame = () => {
    setPlayerHand(null);
    setCpuHand(null);
    setResult(null);
    setCpuThinking(false);
  };

  const resetScore = () => {
    setScore({ win: 0, lose: 0, draw: 0 });
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <header className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl text-yellow-300">✨</span>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              じゃんけんバトル
            </h1>
            <span className="text-2xl text-yellow-300">✨</span>
          </div>
          <p className="text-gray-300 text-lg">モダンなUIでCPUとじゃんけん対戦！</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 対戦エリア */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-center mb-8">対戦</h2>
            
            {/* 手の選択 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {(['rock', 'paper', 'scissors'] as Hand[]).map(hand => (
                <button
                  key={hand}
                  onClick={() => play(hand)}
                  disabled={cpuThinking}
                  className={`p-6 rounded-2xl text-4xl transition-all ${
                    playerHand === hand
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/50'
                      : 'bg-white/10 hover:bg-white/20'
                  } disabled:opacity-50`}
                >
                  {handEmojis[hand]}
                  <div className="text-sm mt-2 font-bold">{handNames[hand]}</div>
                </button>
              ))}
            </div>

            {/* 結果表示 */}
            {playerHand && cpuHand && result && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">あなた</div>
                    <div className="text-4xl font-bold text-cyan-400">{handEmojis[playerHand]}</div>
                    <div className="text-lg">{handNames[playerHand]}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-400 mb-2">CPU</div>
                    <div className="text-4xl font-bold text-pink-400">{handEmojis[cpuHand]}</div>
                    <div className="text-lg">{handNames[cpuHand]}</div>
                  </div>
                </div>

                <div className={`text-center p-6 rounded-2xl ${
                  result === 'win' ? 'bg-gradient-to-r from-green-500/20 to-emerald-600/20' :
                  result === 'lose' ? 'bg-gradient-to-r from-red-500/20 to-rose-600/20' :
                  'bg-gradient-to-r from-yellow-500/20 to-amber-600/20'
                }`}>
                  <div className="text-3xl font-bold mb-2">
                    {result === 'win' ? '勝ち！🎉' : result === 'lose' ? '負け…😢' : 'あいこ！➖'}
                  </div>
                  <div className="text-gray-300">
                    {result === 'win' ? 'おめでとう！' : result === 'lose' ? '次は頑張ろう！' : 'もう一回！'}
                  </div>
                </div>

                <button
                  onClick={resetGame}
                  className="w-full py-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all"
                >
                  もう一度遊ぶ
                </button>
              </div>
            )}

            {/* CPU思考中 */}
            {cpuThinking && (
              <div className="text-center p-6">
                <div className="inline-flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-400"></div>
                  <span className="text-gray-300">CPUが考え中…</span>
                </div>
              </div>
            )}
          </div>

          {/* スコアエリア */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">戦績</h2>
              <button
                onClick={resetScore}
                className="px-4 py-2 bg-gradient-to-r from-red-500/20 to-rose-600/20 rounded-lg font-bold hover:from-red-400/30 hover:to-rose-500/30 transition-all"
              >
                リセット
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-gradient-to-b from-green-500/20 to-emerald-600/20 rounded-2xl">
                <div className="text-3xl mb-2">👑</div>
                <div className="text-3xl font-bold text-green-400">{score.win}</div>
                <div className="text-gray-300">勝ち</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-red-500/20 to-rose-600/20 rounded-2xl">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-3xl font-bold text-red-400">{score.lose}</div>
                <div className="text-gray-300">負け</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-b from-yellow-500/20 to-amber-600/20 rounded-2xl">
                <div className="text-3xl mb-2">⚡</div>
                <div className="text-3xl font-bold text-yellow-400">{score.draw}</div>
                <div className="text-gray-300">あいこ</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl">
                <h3 className="font-bold text-lg mb-2">遊び方</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>グー・チョキ・パーのボタンをクリック</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>CPUがランダムに手を選びます</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>勝敗が自動的に判定されます</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl">
                <h3 className="font-bold text-lg mb-2">じゃんけんルール</h3>
                <div className="text-gray-300 space-y-1">
                  <div>• グー ✊ は チョキ ✌️ に勝つ</div>
                  <div>• チョキ ✌️ は パー ✋ に勝つ</div>
                  <div>• パー ✋ は グー ✊ に勝つ</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>じゃんけんバトル - Next.js + Tailwind CSS</p>
          <p className="mt-1">モダンなUIで楽しくじゃんけん！</p>
        </footer>
      </div>
    </div>
  );
}