'use client';

import { useState } from 'react';

type Hand = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw';

const handEmojis = { rock: '✊', paper: '✋', scissors: '✌️' };
const handNames = { rock: 'グー', paper: 'パー', scissors: 'チョキ' };

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: 'white',
    padding: '1rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '2rem'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '1rem 0'
  },
  gameArea: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  handButton: {
    padding: '1.5rem',
    fontSize: '3rem',
    borderRadius: '1rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white'
  },
  result: {
    padding: '1.5rem',
    borderRadius: '1rem',
    marginTop: '1rem',
    textAlign: 'center' as const
  }
};

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

  const getResultColor = () => {
    if (!result) return '#4a5568';
    if (result === 'win') return '#2d3748';
    if (result === 'lose') return '#2d3748';
    return '#2d3748';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>じゃんけんバトル</h1>
        <p style={{ color: '#a0aec0' }}>シンプルなじゃんけんゲーム</p>
      </div>

      <div style={styles.gameArea}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {(['rock', 'paper', 'scissors'] as Hand[]).map(hand => (
            <button
              key={hand}
              onClick={() => play(hand)}
              disabled={cpuThinking}
              style={{
                ...styles.handButton,
                backgroundColor: playerHand === hand ? '#4299e1' : 'rgba(255, 255, 255, 0.1)',
                opacity: cpuThinking ? 0.5 : 1
              }}
            >
              {handEmojis[hand]}
              <div style={{ fontSize: '0.875rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                {handNames[hand]}
              </div>
            </button>
          ))}
        </div>

        {cpuThinking && (
          <div style={{ textAlign: 'center', padding: '1.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '1.5rem',
                height: '1.5rem',
                border: '2px solid #ed64a6',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ color: '#a0aec0' }}>CPUが考え中…</span>
            </div>
          </div>
        )}

        {playerHand && cpuHand && result && (
          <div style={{ ...styles.result, backgroundColor: getResultColor() }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ color: '#a0aec0', marginBottom: '0.5rem' }}>あなた</div>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#63b3ed' }}>{handEmojis[playerHand]}</div>
                <div style={{ fontSize: '1.125rem' }}>{handNames[playerHand]}</div>
              </div>
              <div>
                <div style={{ color: '#a0aec0', marginBottom: '0.5rem' }}>CPU</div>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ed64a6' }}>{handEmojis[cpuHand]}</div>
                <div style={{ fontSize: '1.125rem' }}>{handNames[cpuHand]}</div>
              </div>
            </div>

            <div style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: result === 'win' ? '#68d391' : result === 'lose' ? '#fc8181' : '#f6e05e'
            }}>
              {result === 'win' ? '勝ち！🎉' : result === 'lose' ? '負け…😢' : 'あいこ！➖'}
            </div>

            <button
              onClick={resetGame}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#4a5568',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              もう一度遊ぶ
            </button>
          </div>
        )}

        <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>戦績</h2>
            <button
              onClick={resetScore}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'rgba(252, 129, 129, 0.2)',
                color: '#fc8181',
                border: 'none',
                borderRadius: '0.375rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              リセット
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(104, 211, 145, 0.1)', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#68d391' }}>{score.win}</div>
              <div style={{ color: '#a0aec0' }}>勝ち</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(252, 129, 129, 0.1)', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fc8181' }}>{score.lose}</div>
              <div style={{ color: '#a0aec0' }}>負け</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(246, 224, 94, 0.1)', borderRadius: '0.75rem' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f6e05e' }}>{score.draw}</div>
              <div style={{ color: '#a0aec0' }}>あいこ</div>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ textAlign: 'center', marginTop: '3rem', color: '#718096', fontSize: '0.875rem' }}>
        <p>じゃんけんバトル - React + インラインスタイル</p>
        <p style={{ marginTop: '0.25rem' }}>シンプルに楽しもう！</p>
      </footer>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}