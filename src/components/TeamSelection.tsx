import React, { useState, useRef, useEffect } from 'react';
import { Team } from '../App';
import './TeamSelection.css';

interface TeamSelectionProps {
    teams: Team[];
    onComplete: (orderedIds: string[]) => void;
}

const TeamSelection: React.FC<TeamSelectionProps> = ({ teams, onComplete }) => {
    const [availableTeams, setAvailableTeams] = useState<Team[]>([...teams]);
    const [orderedTeams, setOrderedTeams] = useState<Team[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [currentSelection, setCurrentSelection] = useState<Team | null>(null);

    const spinWheel = () => {
        if (isSpinning || availableTeams.length <= 1) return;

        setIsSpinning(true);
        setCurrentSelection(null);

        // 1. Pick a random winner index
        const winnerIndex = Math.floor(Math.random() * availableTeams.length);
        const winner = availableTeams[winnerIndex];

        // 2. Calculate angles
        const segmentSize = 360 / availableTeams.length;
        // The center of the winner's segment
        const winnerCenterAngle = (winnerIndex * segmentSize) + (segmentSize / 2);

        // 3. Calculate target rotation
        // We want the winnerCenterAngle to end up at the pointer (Top = 0deg in our CSS logic if we rotate the wheel container)
        // Actually, usually 0deg is 12 o'clock.
        // If we rotate the wheel by -winnerCenterAngle, the winner is at 0.
        // Add extra spins (e.g. 5 * 360).
        // Note: We need to account for the current rotation to ensure smooth transition.

        const extraSpins = 360 * 8;
        // Target: We want (currentRotation + delta) % 360 to align properly.
        // Let's just set a new absolute rotation.
        // To land 'winnerCenterAngle' at the top (0deg), we need to rotate the wheel such that:
        // (InitialAngle + Rotation) % 360 = (360 - winnerCenterAngle)
        // Because if segment is at 90, we rotate -90 (or 270) to bring it to 0.

        const targetRotation = extraSpins + (360 - winnerCenterAngle);

        // We add 'rotation' to keep it monotonic if we wanted, but resetting is fine if we handle it right.
        // Let's just add to current rotation.
        const newRotation = rotation + targetRotation;

        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setCurrentSelection(winner);

            setTimeout(() => {
                const newOrdered = [...orderedTeams, winner];
                setOrderedTeams(newOrdered);

                const remaining = availableTeams.filter(t => t.id !== winner.id);
                setAvailableTeams(remaining);
                setRotation(0); // Reset for next spin
                setCurrentSelection(null);

                // Auto-complete if only 1 team left
                if (remaining.length === 1) {
                    const lastTeam = remaining[0];
                    // Add last team to visual list immediately
                    setOrderedTeams(prev => [...prev, lastTeam]);

                    setTimeout(() => {
                        onComplete([...newOrdered.map(t => t.id), lastTeam.id]);
                    }, 2000);
                }
            }, 3000);

        }, 4000);
    };

    // Generate Conic Gradient
    const getGradient = () => {
        let gradient = 'conic-gradient(';
        const step = 100 / availableTeams.length;
        availableTeams.forEach((team, index) => {
            gradient += `${team.color} ${index * step}% ${(index + 1) * step}%`;
            if (index < availableTeams.length - 1) gradient += ', ';
        });
        gradient += ')';
        return gradient;
    };

    return (
        <div className="selection-container">
            <h2 className="text-heading selection-title">
                {orderedTeams.length < 3 ? `اختيار الفريق رقم ${orderedTeams.length + 1}` : 'جاري تحضير اللعبة...'}
            </h2>

            {availableTeams.length > 1 && (
                <div className="wheel-wrapper">
                    <div className="wheel-pointer">▼</div>
                    <div
                        className="wheel"
                        style={{
                            background: getGradient(),
                            transform: `rotate(${rotation}deg)`,
                            transition: isSpinning ? 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'
                        }}
                    >
                        {availableTeams.map((team, index) => {
                            const segmentSize = 360 / availableTeams.length;
                            const angle = (index * segmentSize) + (segmentSize / 2);
                            return (
                                <div
                                    key={team.id}
                                    className="wheel-text-container"
                                    style={{
                                        transform: `rotate(${angle}deg) translate(0, -140px) rotate(-${angle}deg)`
                                    }}
                                >
                                    <span className="segment-text">{team.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {currentSelection && (
                <div className="winner-overlay">
                    <h1 className="winner-name text-heading" style={{ color: currentSelection.color, textShadow: '4px 4px 0 #000' }}>
                        {currentSelection.name}
                    </h1>
                </div>
            )}

            <div className="controls">
                {availableTeams.length > 1 && !isSpinning && !currentSelection && (
                    <button className="spin-btn comic-btn" onClick={spinWheel}>لف العجلة</button>
                )}
            </div>

            <div className="ordered-list">
                {orderedTeams.map((team, index) => (
                    <div key={team.id} className="ordered-item slide-up" style={{ animationDelay: `${index * 0.1}s`, border: '3px solid #000', boxShadow: '4px 4px 0 #000', background: team.color }}>
                        <span className="rank">{index + 1}</span>
                        <span className="name">{team.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamSelection;
