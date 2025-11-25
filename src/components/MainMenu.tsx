import React from 'react';
import './MainMenu.css';

interface MainMenuProps {
    onStart: () => void;
    onExit: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onExit }) => {
    return (
        <div className="main-menu fade-in">
            <h1 className="menu-title text-heading">ريسك</h1>
            <div className="menu-options">
                <button className="menu-btn start-btn" onClick={onStart}>ابدأ اللعبة</button>
                <button className="menu-btn exit-btn" onClick={onExit}>خروج</button>
            </div>
        </div>
    );
};

export default MainMenu;
