import React, { useState } from 'react';

export default function MultipleChoice({ question, onAnswerSelected }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleAnswerChange = (e, answer) => {
        e.preventDefault();
        const answerData = {
            questionNumber: question.questionNumber,
            selectedAnswer: answer,
            isCorrect: answer === question.answer
        }
        setSelectedAnswer(answer);
        onAnswerSelected(answerData);
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{question.questionNumber}. {question.question}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                {question.answerChoices.map((answer, index) => (
                    <button
                        key={index}
                        className={`w-full p-2 rounded-lg text-left ${selectedAnswer === answer ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-900'} text-white`}
                        onClick={(e) => handleAnswerChange(e, answer)}
                    >{answer}</button>
                ))}
            </div>
        </div>
    )
}