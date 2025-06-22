import React, { useEffect, useState } from 'react';

export default function Matching({ flashcards, startQuestionNumber, onAnswerSelected }) {
    const [questions, setQuestions] = useState([]);
    const [possibleAnswers, setPossibleAnswers] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    useEffect(() => {
        const shuffledFlashcards = flashcards.sort(() => Math.random() - 0.5);
        setQuestions(shuffledFlashcards);
        const reshuffledFlashcards = shuffledFlashcards.sort(() => Math.random() - 0.5);
        setPossibleAnswers(reshuffledFlashcards.map(card => card.answer));
    }, [flashcards]);

    const handleAnswerChange = (questionNumber, answer) => {
        const answerData = {
            questionNumber: questionNumber,
            selectedAnswer: answer,
            isCorrect: questions[questionNumber - startQuestionNumber].answer === answer
        }
        setSelectedAnswers(prev => ({ ...prev, [questionNumber]: answer }));
        onAnswerSelected(answerData);
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">Matching Questions</h2>
            <div className="flex flex-col mb-4 w-full">
                {questions.map((flashcard, index) => {
                    const questionNumber = startQuestionNumber + index;
                    return (
                        <div key={index} className="flex flex-row items-center justify-between p-4 bg-gray-800 rounded-lg mb-2">
                            <span className="text-lg">{questionNumber}. {flashcard.question}</span>
                            <select
                                value={selectedAnswers[questionNumber] || ''}
                                onChange={(e) => handleAnswerChange(questionNumber, e.target.value)}
                                className="p-2 rounded-lg bg-gray-600"
                            >
                                <option value="" disabled>Select an answer</option>
                                {possibleAnswers.map((answer, answerIndex) => (
                                    <option key={answerIndex} value={answer}>{answer}</option>
                                ))}
                            </select>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}