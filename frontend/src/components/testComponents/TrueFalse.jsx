import React, { useState } from 'react';

export default function TrueFalse({ question, onAnswerSelected }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const handleAnswerChange = (e, answer) => {
        e.preventDefault();
        const answerData = {
            questionNumber: question.questionNumber,
            selectedAnswer: answer,
            isCorrect: answer ? question.answerChoice === question.answer : question.answerChoice !== question.answer
        };
        setSelectedAnswer(answer);
        onAnswerSelected(answerData);
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-surface-a1 rounded-lg mb-4">
            <h2 className="text-2xl mb-4">{question.questionNumber}. {question.question}</h2>
            <p className="mb-4 text-lg">Answer: {question.answerChoice} (Is this true or false?)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                <button
                    className= {`w-full p-2 rounded-lg text-left ${selectedAnswer === true ? 'bg-primary-a0 hover:bg-primary-a1' : 'bg-surface-a2 hover:bg-surface-a3'}`}
                    onClick={(e) => handleAnswerChange(e, true)}
                >True</button>
                <button
                    className= {`w-full p-2 rounded-lg text-left ${selectedAnswer === false ? 'bg-primary-a0 hover:bg-primary-a1' : 'bg-surface-a2 hover:bg-surface-a3'}`}
                    onClick={(e) => handleAnswerChange(e, false)}
                >False</button>
            </div>
        </div>
    )
}