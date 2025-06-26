import React, { useEffect, useState } from 'react';

export default function Matching({ questions, onAnswerSelected }) {
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    useEffect(() => {
        if (shuffledAnswers.length > 0) return;
        const answers = questions.map(question => question.answer);
        const shuffled = answers.sort(() => Math.random() - 0.5);
        setShuffledAnswers(shuffled);
    }, [questions, shuffledAnswers]);

    const handleAnswerChange = (questionNumber, answer) => {
        const answerData = {
            questionNumber: questionNumber,
            selectedAnswer: answer,
            isCorrect: questions.filter(question => question.questionNumber === questionNumber)[0].answer === answer
        }
        setSelectedAnswers(prev => ({ ...prev, [questionNumber]: answer }));
        onAnswerSelected(answerData);
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">Matching Questions</h2>
            <div className="flex flex-col mb-4 w-full">
                {questions.map((question, index) => (
                    <div key={index} className="flex flex-row items-center justify-between p-4 bg-gray-800 rounded-lg mb-2">
                        <span className="text-lg">{question.questionNumber}. {question.question}</span>
                        <select
                            value={selectedAnswers[question.questionNumber] || ''}
                            onChange={(e) => handleAnswerChange(question.questionNumber, e.target.value)}
                            className="p-2 rounded-lg bg-gray-600"
                        >
                            <option value="" disabled>Select an answer</option>
                            {shuffledAnswers.map((answer, answerIndex) => (
                                <option key={answerIndex} value={answer}>{answer}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>
        </div>
    )
}