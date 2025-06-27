import React, { useEffect, useState } from 'react';

export default function MultipleChoice({ flashcard, otherAnswers, onAnswerSelected }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerChoices, setAnswerChoices] = useState([]);

    useEffect(() => {
        setSelectedAnswer(null);
        const shuffledAnswers = [...otherAnswers, flashcard.answer].sort(() => Math.random() - 0.5);
        setAnswerChoices(shuffledAnswers);
    }, [flashcard, otherAnswers]);

    const handleAnswerChange = (e, answer) => {
        e.preventDefault();
        setSelectedAnswer(answer);
        onAnswerSelected(answer);
    }

    return (
        <div className="flex flex-col items-center justify-center px-2 w-full rounded-lg">
            <h2 className="text-2xl mb-4">{flashcard.question}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                {answerChoices.map((answer, index) => (
                    <button
                        key={index}
                        className={`w-full p-2 rounded-lg text-left ${selectedAnswer === answer ? 'bg-primary-a0 hover:bg-primary-a1' : 'bg-surface-a2 hover:bg-surface-a3'}`}
                        onClick={(e) => handleAnswerChange(e, answer)}
                    >{answer}</button>
                ))}
            </div>
        </div>
    )
}