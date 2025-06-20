import React, { useState } from 'react';

export default function Flashcard({ flashcardData }) {
    const [onScreen, setOnScreen] = useState('question');

    const flipCard = () => {
        setOnScreen(prev => (prev === 'question' ? 'answer' : 'question'));
    }

    return (
        <button className="flex items-center justify-center aspect-[2/1] w-full bg-gray-700 p-4 rounded-lg shadow-lg mb-4" onClick={flipCard}>
            <p className="text-4xl">{onScreen === 'question' ? flashcardData.question : flashcardData.answer}</p>
        </button>
    )
}