import React, { useEffect, useState } from 'react';

export default function Flashcard({ flashcardData }) {
    const [flipped, setFlipped] = useState(false);
    const [disableTransition, setDisableTransition] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                setFlipped(prev => !prev);
            }
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);

    useEffect(() => {
        setDisableTransition(true);
        setFlipped(false); // Reset flip state when new data is received

        const timer = setTimeout(() => {
            setDisableTransition(false);
        }, 100); // Delay to allow the transition to reset
        return () => clearTimeout(timer);
    }, [flashcardData]);

    return (
        <div className="aspect-[2/1] w-full [perspective:1000px] text-3xl" onClick={() => setFlipped(!flipped)}>
            <div className={`relative w-full h-full ${disableTransition ? '' : 'duration-700 transition-transform'} [transform-style:preserve-3d] ${flipped ? '[transform:rotateX(180deg)]': ''}`}>
                <div className="absolute w-full h-full bg-surface-a1 rounded-lg shadow-lg flex items-center justify-center [backface-visibility:hidden]">
                    {flashcardData.question}
                </div>
                <div className="absolute w-full h-full bg-surface-a1 rounded-lg shadow-lg flex items-center justify-center [transform:rotateX(180deg)] [backface-visibility:hidden]">
                    {flashcardData.answer}
                </div>
            </div>
        </div>
    )
}