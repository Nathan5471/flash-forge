import React, { useEffect, useState } from 'react';

export default function TrueFalse({ flashcard, otherAnswer, onAnswerSelected }) {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [trueAnswer, setTrueAnswer] = useState(null);
    const [falseAnswer, setFalseAnswer] = useState(null);

    useEffect(() => {
        setSelectedAnswer(null);
        setTrueAnswer(null);
        setFalseAnswer(null);
        const shuffledAnswers = [flashcard.answer, otherAnswer].sort(() => Math.random() - 0.5);
        setTrueAnswer(shuffledAnswers[0]);
        setFalseAnswer(shuffledAnswers[1]);
    }, [flashcard, otherAnswer]);

    const handleAnswerChange = (e, answer) => {
        e.preventDefault();
        if (answer === true) {
            setSelectedAnswer(true);
            if (typeof trueAnswer === 'string') {
                onAnswerSelected(trueAnswer);
            } else if (Array.isArray(trueAnswer) && trueAnswer.length > 0) {
                onAnswerSelected(trueAnswer[0]);
            }
        } else {
            setSelectedAnswer(false);
            if (typeof falseAnswer === 'string') {
                onAnswerSelected(falseAnswer);
            } else if (Array.isArray(falseAnswer) && falseAnswer.length > 0) {
                onAnswerSelected(falseAnswer[0]);
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center px-2 w-full rounded-lg">
            <h2 className="text-2xl mb-4">{flashcard.question}</h2>
            <p className="mb-4 text-lg">Answer: {trueAnswer} (Is this true or false?)</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 w-full">
                <button
                    className={`w-full p-2 rounded-lg text-left ${selectedAnswer === true ? 'bg-primary-a0 hover:bg-primary-a1' : 'bg-surface-a2 hover:bg-surface-a3'}`}
                    onClick={(e) => handleAnswerChange(e, true)}
                >True</button>
                <button
                    className={`w-full p-2 rounded-lg text-left ${selectedAnswer === false ? 'bg-primary-a0 hover:bg-primary-a1' : 'bg-surface-a2 hover:bg-surface-a3'}`}
                    onClick={(e) => handleAnswerChange(e, false)}
                >False</button>
            </div>
        </div>
    )
}