import React, { useState } from 'react';

export default function Written({ question, onAnswerSelected }) {
    const [userAnswer, setUserAnswer] = useState('');

    const handleAnswerChange = (e) => {
        setUserAnswer(e.target.value);
        const answerData = {
            questionNumber: question.questionNumber,
            selectedAnswer: e.target.value,
            isCorrect: e.target.value.trim().toLowerCase() === question.answer.trim().toLowerCase()
        }
        onAnswerSelected(answerData);
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-surface-a1 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{question.questionNumber}. {question.question}</h2>
            <input
                type="text"
                value={userAnswer}
                onChange={(e) => handleAnswerChange(e)}
                className="w-full p-2 rounded-lg bg-surface-a2"
                placeholder="Type your answer here..."
            />
        </div>
    )
}