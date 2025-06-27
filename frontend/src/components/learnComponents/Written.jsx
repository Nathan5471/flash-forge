import React, { useEffect, useState } from 'react';

export default function Written({ flashcard, onAnswerSelected }) {
    const [userAnswer, setUserAnswer] = useState('');

    useEffect(() => {
        setUserAnswer('');
    }, [flashcard]);

    const handleAnswerChange = (e) => {
        const answer = e.target.value;
        onAnswerSelected(answer);
        setUserAnswer(answer);
    }

    return (
        <div className="flex flex-col items-center justify-center px-2 rounded-lg w-full">
            <h2 className="text-2xl mb-4">{flashcard.question}</h2>
            <input
                type="text"
                value={userAnswer}
                onChange={handleAnswerChange}
                className="w-full p-2 rounded-lg bg-surface-a2 text-white"
                placeholder="Type your answer here..."
            />
        </div>
    )
}