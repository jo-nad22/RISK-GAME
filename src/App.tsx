import React, { useState } from 'react';
import Intro from './components/Intro';
import MainMenu from './components/MainMenu';
import TeamSelection from './components/TeamSelection';
import GameBoard from './components/GameBoard';
import EndScreen from './components/EndScreen';
import './App.css';

export type GamePhase = 'INTRO' | 'MENU' | 'SELECTION' | 'BOARD' | 'END';

export interface Team {
  id: string;
  name: string;
  color: string;
  score: number;
}

function App() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('INTRO');
  const [teams, setTeams] = useState<Team[]>([
    { id: '1', name: 'راجيس', score: 0, color: '#FF4757' },
    { id: '2', name: 'نينوى', score: 0, color: '#2ED573' },
    { id: '3', name: 'أراراط', score: 0, color: '#FFA502' },
    { id: '4', name: 'أورشليم', score: 0, color: '#70a1ff' },
  ]);
  const [turnOrder, setTurnOrder] = useState<string[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [stealAbilityHolder, setStealAbilityHolder] = useState<string | null>(null);

  const handleIntroComplete = () => setGamePhase('MENU');
  const handleStartGame = () => setGamePhase('SELECTION');

  const handleSelectionComplete = (orderedIds: string[]) => {
    setTurnOrder(orderedIds);
    setGamePhase('BOARD');
  };

  const handleScoreUpdate = (teamId: string, points: number) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, score: t.score + points } : t));
  };

  const handleNextTurn = () => {
    setCurrentTurnIndex(prev => (prev + 1) % turnOrder.length);
  };

  const handleGameEnd = () => {
    setGamePhase('END');
  };

  return (
    <div className="game-container">
      {gamePhase === 'INTRO' && <Intro onComplete={handleIntroComplete} />}
      {gamePhase === 'MENU' && <MainMenu onStart={handleStartGame} onExit={() => window.close()} />}
      {gamePhase === 'SELECTION' && <TeamSelection teams={teams} onComplete={handleSelectionComplete} />}
      {gamePhase === 'BOARD' && (
        <GameBoard
          teams={teams}
          turnOrder={turnOrder}
          currentTurnIndex={currentTurnIndex}
          onScoreUpdate={handleScoreUpdate}
          onNextTurn={handleNextTurn}
          onGameEnd={handleGameEnd}
          stealAbilityHolder={stealAbilityHolder}
          setStealAbilityHolder={setStealAbilityHolder}
        />
      )}
      {gamePhase === 'END' && <EndScreen teams={teams} />}
    </div>
  );
}

export default App;
