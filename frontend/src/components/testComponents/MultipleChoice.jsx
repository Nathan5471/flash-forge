import React, { useEffect, useState } from 'react';

export default function MultipleChoice({ flashcard, questionNumber, possibleAnswers, onAnswerSelected }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answerChoices, setAnswerChoices] = useState([]);

    useEffect(() => {
        const shuffledAnswers = possibleAnswers.filter(answer => answer !== flashcard.answer).sort(() => Math.random() - 0.5);
        const unshuffledAnswerChoices = shuffledAnswers.slice(0, 3).concat(flashcard.answer);
        setAnswerChoices(unshuffledAnswerChoices.sort(() => Math.random() - 0.5));
    }, [flashcard, possibleAnswers]);

    const handleAnswerChange = (e, answer) => {
        e.preventDefault();
        const answerData = {
            questionNumber: questionNumber,
            selectedAnswer: answer,
            isCorrect: answer === flashcard.answer
        }
        setSelectedAnswer(answer);
        onAnswerSelected(answerData);
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{questionNumber}. {flashcard.question}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                {answerChoices.map((answer, index) => (
                    <button
                        key={index}
                        className={`w-full p-2 rounded-lg text-left ${selectedAnswer === answer ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'} text-white`}
                        onClick={(e) => handleAnswerChange(e, answer)}
                    >{answer}</button>
                ))}
            </div>
        </div>
    )
}