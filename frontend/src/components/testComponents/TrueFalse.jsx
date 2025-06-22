import React, { useEffect, useState } from 'react';

export default function TrueFalse({ flashcard, questionNumber, answerChoices, onAnswerSelected }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [givenAnswer, setGivenAnswer] = useState(null);

    useEffect(() => {
        const shuffledAnswers = answerChoices.filter(answer => answer !== flashcard.answer).sort(() => Math.random() - 0.5);
        const unshuffledAnswerChoices = shuffledAnswers.slice(0, 1).concat(flashcard.answer);
        setGivenAnswer(unshuffledAnswerChoices.sort(() => Math.random() - 0.5)[0]);
    }, [flashcard, answerChoices]);

    const handleAnswerChange = (e, answer) => {
        e.preventDefault();
        const answerData = {
            questionNumber: questionNumber,
            selectedAnswer: answer,
            isCorrect: answer ? givenAnswer === flashcard.answer : givenAnswer !== flashcard.answer
        };
        setSelectedAnswer(answer);
        onAnswerSelected(answerData);
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{questionNumber}. {flashcard.question}</h2>
            <p className="mb-4 text-lg">Answer: {givenAnswer} (Is this true or false?)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                <button
                    className= {`w-full p-2 rounded-lg text-left ${selectedAnswer === true ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-900'}`}
                    onClick={(e) => handleAnswerChange(e, true)}
                >True</button>
                <button
                    className= {`w-full p-2 rounded-lg text-left ${selectedAnswer === false ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-900'}`}
                    onClick={(e) => handleAnswerChange(e, false)}
                >False</button>
            </div>
        </div>
    )
}