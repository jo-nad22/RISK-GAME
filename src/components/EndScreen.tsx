import React from 'react';
import { Team } from '../App';
import './EndScreen.css';

interface EndScreenProps {
    teams: Team[];
}

const EndScreen: React.FC<EndScreenProps> = ({ teams }) => {
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    return (
        <div className="end-screen">
            <h1 className="end-title text-heading">النتائج النهائية</h1>

            <div className="podium">
                {/* 2nd Place */}
                <div className="podium-place place-2 slide-up" style={{ animationDelay: '0.5s' }}>
                    <div className="medal silver">2</div>
                    <div className="podium-bar" style={{ height: '200px', background: sortedTeams[1].color }}>
                        <div className="podium-name">{sortedTeams[1].name}</div>
                        <div className="podium-score">{sortedTeams[1].score}</div>
                    </div>
                </div>

                {/* 1st Place */}
                <div className="podium-place place-1 slide-up" style={{ animationDelay: '1s' }}>
                    <div className="crown">👑</div>
                    <div className="medal gold">1</div>
                    <div className="podium-bar" style={{ height: '300px', background: sortedTeams[0].color }}>
                        <div className="podium-name">{sortedTeams[0].name}</div>
                        <div className="podium-score">{sortedTeams[0].score}</div>
                    </div>
                </div>

                {/* 3rd Place */}
                <div className="podium-place place-3 slide-up" style={{ animationDelay: '0.7s' }}>
                    <div className="medal bronze">3</div>
                    <div className="podium-bar" style={{ height: '150px', background: sortedTeams[2].color }}>
                        <div className="podium-name">{sortedTeams[2].name}</div>
                        <div className="podium-score">{sortedTeams[2].score}</div>
                    </div>
                </div>
            </div>

            <div className="other-places">
                <div className="place-item">
                    <span>4. {sortedTeams[3].name}</span>
                    <span>{sortedTeams[3].score} نقطة</span>
                </div>
            </div>
        </div>
    );
};

export default EndScreen;
