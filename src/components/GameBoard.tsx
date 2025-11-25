import React, { useState, useEffect } from 'react';
import { Team } from '../App';
import { INITIAL_CATEGORIES, Category, Question } from '../data/questions';
import QuestionModal from './QuestionModal';
import './GameBoard.css';

interface GameBoardProps {
    teams: Team[];
    turnOrder: string[];
    currentTurnIndex: number;
    onScoreUpdate: (teamId: string, points: number) => void;
    onNextTurn: () => void;
    onGameEnd: () => void;
    stealAbilityHolder: string | null;
    setStealAbilityHolder: (teamId: string | null) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
    teams,
    turnOrder,
    currentTurnIndex,
    onScoreUpdate,
    onNextTurn,
    onGameEnd,
    stealAbilityHolder,
    setStealAbilityHolder
}) => {
    const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

    const currentTeamId = turnOrder[currentTurnIndex];
    const currentTeam = teams.find(t => t.id === currentTeamId);

    // Check if all questions are answered
    useEffect(() => {
        const allAnswered = categories.every(c => c.questions.every(q => q.isAnswered));
        if (allAnswered) {
            onGameEnd();
        }
    }, [categories, onGameEnd]);

    const handleCategoryClick = (points: number) => {
        if (selectedCategory === points) {
            setSelectedCategory(null); // Toggle off
        } else {
            setSelectedCategory(points);
        }
    };

    const handleQuestionClick = (question: Question) => {
        if (question.isAnswered) return;
        setActiveQuestion(question);
    };

    const handleAnswer = (isCorrect: boolean) => {
        if (!activeQuestion) return;

        let pointsEarned = 0;
        if (isCorrect) {
            pointsEarned = activeQuestion.points;
            if (activeQuestion.isDouble) pointsEarned *= 2;
        }

        // Mark as answered
        setCategories(prev => prev.map(c => ({
            ...c,
            questions: c.questions.map(q => q.id === activeQuestion.id ? { ...q, isAnswered: true } : q)
        })));

        // Update score (logic for who gets points is handled in QuestionModal via activeTeamId, 
        // but here we just need to know IF points were earned and apply to the CURRENT active team in modal context.
        // However, QuestionModal doesn't pass back the team ID. 
        // Simplified: We will assume the points go to the team whose turn it effectively was (handled by modal logic if we moved score there, but let's keep it simple).
        // Actually, to support stealing, we need to know WHO answered.
        // Let's refactor slightly: QuestionModal should tell us WHO answered correctly.
    };

    // Revised handler to accept the answering team ID
    const handleQuestionComplete = (answeringTeamId: string, points: number) => {
        if (!activeQuestion) return;

        // Mark as answered
        setCategories(prev => prev.map(c => ({
            ...c,
            questions: c.questions.map(q => q.id === activeQuestion.id ? { ...q, isAnswered: true } : q)
        })));

        if (points > 0) {
            onScoreUpdate(answeringTeamId, points);
        }

        setActiveQuestion(null);
        setSelectedCategory(null);
        onNextTurn();
    };

    const handleCloseModal = () => {
        setActiveQuestion(null);
    };

    return (
        <div className="board-container">
            {/* Scoreboard Left */}
            <div className="scoreboard left">
                {teams.slice(0, 2).map(t => (
                    <div key={t.id} className={`score-card ${t.id === currentTeamId ? 'active-turn' : ''}`} style={{ borderColor: t.color }}>
                        <div className="team-name">{t.name}</div>
                        <div className="team-score">{t.score}</div>
                    </div>
                ))}
            </div>

            {/* Main Board */}
            <div className="main-board">
                <div className="turn-indicator">
                    دور فريق: <span style={{ color: currentTeam?.color }}>{currentTeam?.name}</span>
                </div>

                <div className="categories-grid">
                    {categories.map(cat => (
                        <div key={cat.points} className="category-column">
                            <button
                                className={`category-card ${selectedCategory === cat.points ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(cat.points)}
                            >
                                {cat.points}
                            </button>

                            {selectedCategory === cat.points && (
                                <div className="questions-list slide-up">
                                    {cat.questions.map((q) => (
                                        <button
                                            key={q.id}
                                            className={`question-card ${q.isAnswered ? 'answered' : ''}`}
                                            onClick={() => handleQuestionClick(q)}
                                            disabled={q.isAnswered}
                                        >
                                            {q.isAnswered ? 'X' : '?'}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Scoreboard Right */}
            <div className="scoreboard right">
                {teams.slice(2, 4).map(t => (
                    <div key={t.id} className={`score-card ${t.id === currentTeamId ? 'active-turn' : ''}`} style={{ borderColor: t.color }}>
                        <div className="team-name">{t.name}</div>
                        <div className="team-score">{t.score}</div>
                    </div>
                ))}
            </div>

            {activeQuestion && (
                <QuestionModal
                    question={activeQuestion}
                    onClose={handleCloseModal}
                    onComplete={handleQuestionComplete}
                    currentTeamId={currentTeamId}
                    stealAbilityHolder={stealAbilityHolder}
                    setStealAbilityHolder={setStealAbilityHolder}
                    teams={teams}
                />
            )}
        </div>
    );
};

export default GameBoard;
