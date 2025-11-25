import React, { useState, useEffect } from 'react';
import { Question } from '../data/questions';
import { Team } from '../App';
import './QuestionModal.css';

interface QuestionModalProps {
    question: Question;
    onClose: () => void;
    onComplete: (answeringTeamId: string, points: number) => void;
    currentTeamId: string;
    stealAbilityHolder: string | null;
    setStealAbilityHolder: (teamId: string | null) => void;
    teams: Team[];
}

const QuestionModal: React.FC<QuestionModalProps> = ({
    question,
    onClose,
    onComplete,
    currentTeamId,
    stealAbilityHolder,
    setStealAbilityHolder,
    teams
}) => {
    const [timeLeft, setTimeLeft] = useState(30);
    const [activeTeamId, setActiveTeamId] = useState(currentTeamId);
    const [isStolen, setIsStolen] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);

    // Handle Special Cards Intro
    useEffect(() => {
        if (question.isSteal || question.isDouble) {
            const timer = setTimeout(() => {
                setIsRevealed(true);
                setShowQuestion(true);
            }, 3000); // 3 seconds surprise reveal
            return () => clearTimeout(timer);
        } else {
            setIsRevealed(true);
            setShowQuestion(true);
        }
    }, [question]);

    useEffect(() => {
        if (showQuestion && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft, showQuestion]);

    const handleCorrect = () => {
        let points = question.points;
        if (question.isDouble) points *= 2;

        // If this was a special steal question and answered by the original owner (not stolen yet)
        if (question.isSteal && !isStolen && activeTeamId === currentTeamId) {
            setStealAbilityHolder(activeTeamId);
            alert(`مبروك! فريق ${teams.find(t => t.id === activeTeamId)?.name} حصل على ميزة سرقة سؤال!`);
        }

        // If this was a stolen turn, consume the ability
        if (isStolen) {
            setStealAbilityHolder(null);
        }

        onComplete(activeTeamId, points);
    };

    const handleWrong = () => {
        onComplete(activeTeamId, 0);
    };

    const handleStealAction = () => {
        if (stealAbilityHolder) {
            setActiveTeamId(stealAbilityHolder);
            setIsStolen(true);
            setTimeLeft(30); // Reset timer for stealer
        }
    };

    const activeTeam = teams.find(t => t.id === activeTeamId);
    const stealerTeam = teams.find(t => t.id === stealAbilityHolder);

    return (
        <div className="modal-overlay">
            <div className="modal-content scale-up">

                {/* Surprise Phase */}
                {!isRevealed && (
                    <div className="surprise-box" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '4rem', color: '#FF4757', textShadow: '4px 4px 0 #000' }}>مفاجأة!</h2>
                    </div>
                )}

                {showQuestion && (
                    <>
                        {question.isSteal && <div className="special-badge">سرقة سؤال!</div>}
                        {question.isDouble && <div className="special-badge">نقاط مضاعفة!</div>}

                        <div className="modal-header">
                            <div className="team-indicator" style={{ color: activeTeam?.color, fontSize: '1.5rem', fontWeight: 'bold' }}>
                                الفريق المجيب: {activeTeam?.name}
                            </div>
                            <div className={`timer ${timeLeft <= 10 ? 'warning' : ''}`}>
                                {timeLeft}
                            </div>
                            <div className="points-badge">
                                {question.points}
                            </div>
                        </div>

                        <div className="question-text">
                            {question.text}
                        </div>

                        <div className="modal-footer">
                            <button className="control-btn correct-btn" onClick={handleCorrect}>إجابة صحيحة</button>
                            <button className="control-btn wrong-btn" onClick={handleWrong}>إجابة خاطئة</button>

                            {/* Show Steal Button if ability exists and it's not the holder's turn */}
                            {stealAbilityHolder && stealAbilityHolder !== currentTeamId && !isStolen && (
                                <button className="control-btn steal-btn" onClick={handleStealAction}>
                                    سرقة السؤال بواسطة {stealerTeam?.name}!
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default QuestionModal;
