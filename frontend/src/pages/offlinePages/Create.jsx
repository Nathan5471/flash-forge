import React, { useState } from 'react';
import { createOfflineFlashcardSet } from '../../utils/DownloadManager';
import Navbar from '../../components/offlineComponents/Navbar';
import { FaRegTrashAlt } from "react-icons/fa";

export default function Create() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [flashcards, setFlashcards] = useState([{ question: '', answer: '' }]);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        const flashcardSetData = {
            title,
            description,
            flashCards: flashcards.filter(flashcard => flashcard.question && flashcard.answer)
        }
        try {
            const response = createOfflineFlashcardSet(flashcardSetData);
            if (response === null) {
                throw new Error('Failed to create flashcard set. Please ensure all fields are filled out correctly.');
            }
            setTitle('');
            setDescription('');
            setFlashcards([{ question: '', answer: '' }]);
        } catch (error) {
            setError(error ? error.message : 'An error occurred while creating the flashcard set.');
        }
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center mt-6">
                <h1 className="text-4xl font-bold mb-4">Create Offline Flashcard Set</h1>
                <form className="w-1/2 bg-gray-700 p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                    <p className="text-lg mb-4">This set will be local only and not accessible on the online part of the website. You can make a new flashcard set in the online mode and import ones you make offline.</p>
                    <div className="mb-4">
                        <label className="block text-2xl">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                            className="w-full p-2 mt-2 bg-gray-600 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-2xl">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            className="w-full p-2 mt-2 bg-gray-600 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-2xl">Questions</label>
                        <div className="flex flex-row justify-around mt-2">
                            <p className="text-lg">Question</p>
                            <p className="text-lg">Answer</p>
                        </div>
                        {flashcards.map((flashcard, index) => (
                            <div key={index} className="flex flex-row items-center justify-center">
                                <p className="text-lg mr-2">{index + 1}.</p>
                                <input
                                    type="text"
                                    value={flashcard.question}
                                    onChange={(e) => {
                                        const newFlashcards = [...flashcards];
                                        newFlashcards[index].question = e.target.value;
                                        setFlashcards(newFlashcards);
                                    }}
                                    placeholder="Enter question"
                                    className="w-1/2 p-2 mt-2 mr-1 bg-gray-600 rounded-lg"
                                />
                                <input
                                    type="text"
                                    value={flashcard.answer}
                                    onChange={(e) => {
                                        const newFlashcards = [...flashcards];
                                        newFlashcards[index].answer = e.target.value;
                                        setFlashcards(newFlashcards);
                                    }}
                                    placeholder="Enter answer"
                                    className="w-1/2 p-2 mt-2 bg-gray-600 rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newFlashcards = flashcards.filter((_, i) => i !== index);
                                        setFlashcards(newFlashcards);
                                    }}
                                    className="ml-2 hover:text-gray-300"
                                ><FaRegTrashAlt /></button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFlashcards([...flashcards, { question: '', answer: '' }])}
                            className="mt-2 bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg"
                        >Add question</button>
                    </div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg"
                    >Create Offline Flashcard Set</button>
                </form>
            </div>
        </div>
    )
}