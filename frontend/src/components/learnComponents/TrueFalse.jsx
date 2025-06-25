import React, { useEffect, useState } from 'react';

export default function TrueFalse({ flashcard, questionOrder, otherAnswer, onAnswerSelected }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [givenAnswer, setGivenAnswer] = useState(null);

    useEffect(() => {
        setSelectedAnswer(null);
        setGivenAnswer(null);
        const shuffledAnswers = [flashcard.answer, otherAnswer].sort(() => Math.random() - 0.5);
        setGivenAnswer(shuffledAnswers[0]);
    }, [flashcard, otherAnswer]);

    const handleAnswerChange = (e, answer) => {
        e.preventDefault();
        if (answer === true) {
            setSelectedAnswer(true);
            onAnswerSelected(questionOrder, givenAnswer);
        } else {
            setSelectedAnswer(false);
            onAnswerSelected(questionOrder, givenAnswer === flashcard.answer ? otherAnswer : flashcard.answer);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 w-full rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{flashcard.question}</h2>
            <p className="mb-4 text-lg">Answer: {givenAnswer} (Is this true or false?)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                <button
                    className={`w-full p-2 rounded-lg text-left ${selectedAnswer === true ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-900'}`}
                    onClick={(e) => handleAnswerChange(e, true)}
                >True</button>
                <button
                    className={`w-full p-2 rounded-lg text-left ${selectedAnswer === false ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-900'}`}
                    onClick={(e) => handleAnswerChange(e, false)}
                >False</button>
            </div>
        </div>
    )
}