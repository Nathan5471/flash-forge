import React, { useState } from 'react';

export default function Written({ flashcard, questionNumber, onAnswerSelected }) {
    const [userAnswer, setUserAnswer] = useState('');

    const handleAnswerChange = (e) => {
        setUserAnswer(e.target.value);
        const answerData = {
            questionNumber: questionNumber,
            selectedAnswer: e.target.value,
            isCorrect: e.target.value.trim().toLowerCase() === flashcard.answer.trim().toLowerCase()
        }
        onAnswerSelected(answerData);
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{questionNumber}. {flashcard.question}</h2>
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => handleAnswerChange(e)}
                className="w-full p-2 rounded-lg bg-gray-800"
                placeholder="Type your answer here..."
            />
        </div>
    )
}