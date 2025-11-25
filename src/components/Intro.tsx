import React, { useEffect, useState } from 'react';
import './Intro.css';

// Placeholders
// Placeholders
const LOGO_1 = "/logo1.jpeg";
const LOGO_2 = "/logo2.png";

interface IntroProps {
    onComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timer1 = setTimeout(() => setStep(1), 1000); // Show Logos
        const timer2 = setTimeout(() => setStep(2), 5000); // Show Title
        const timer3 = setTimeout(() => onComplete(), 10000); // Finish

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [onComplete]);

    return (
        <div className="intro-container">
            {step === 1 && (
                <div className="intro-slide fade-in">
                    <div className="logos-container">
                        <img src={LOGO_1} alt="Logo 1" className="intro-logo" />
                        <img src={LOGO_2} alt="Logo 2" className="intro-logo" />
                    </div>
                    <h2 className="text-heading" style={{ fontSize: '3rem', color: '#fff', marginTop: '20px' }}>Presents</h2>
                </div>
            )}
            {step === 2 && (
                <div className="intro-slide scale-up">
                    <h1 className="game-title text-heading">ريسك</h1>
                    <p className="subtitle">لعبة التحدي والمعرفة</p>
                </div>
            )}
            {step === 3 && (
                <div className="intro-slide scale-up">
                    <h1 className="game-title text-heading">ريسك</h1>
                    <p className="subtitle">لعبة التحدي والمعرفة</p>
                </div>
            )}
        </div>
    );
};

export default Intro;
