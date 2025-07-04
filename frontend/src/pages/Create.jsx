import React, { useState } from 'react'
import { useOverlayContext } from '../contexts/OverlayContext';
import { createFlashcardSet } from '../utils/FlashcardAPIHandler';
import { createOfflineFlashcardSet } from '../utils/DownloadManager';
import Navbar from '../components/Navbar'
import { FaRegTrashAlt } from "react-icons/fa";
import ImportFlashcards from '../components/ImportFlashcards';
import OfflineImport from '../components/OfflineImport';

export default function Create({ isOffline = false }) {
    const { openOverlay } = useOverlayContext();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [flashcards, setFlashcards] = useState([{ question: '', answer: '' }]);
    const [error, setError] = useState(null);

    const handleImport = (importedFlashcards) => {
        if (flashcards[0].question === '' && flashcards[0].answer === '') {
            setFlashcards(importedFlashcards);
        } else {
            const newFlashcards = flashcards.concat(importedFlashcards);
            setFlashcards(newFlashcards);
        }
    }

    const handleOpenImport = (e) => {
        e.preventDefault();
        openOverlay(<ImportFlashcards importFlashcards={handleImport} />);
    }

    const handleOpenOfflineImport = (e) => {
        e.preventDefault();
        openOverlay(<OfflineImport onImport={handleImport} />);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const flashcardSetData = {
            title,
            description,
            flashcards: flashcards.filter(flashcard => flashcard.question && flashcard.answer)
        }
        try {
            if (isOffline) {
                await createOfflineFlashcardSet(flashcardSetData);
            } else {
                await createFlashcardSet(flashcardSetData);
            }
            setTitle('');
            setDescription('');
            setFlashcards([{ question: '', answer: '' }]);
        } catch (error) {
            setError(error ? error.message : 'An error occurred while creating the flashcard set.');
        }
    }


    return (
        <div className="flex flex-col min-h-screen w-screen bg-tonal-a0 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center mt-6">
                <h1 className="text-4xl text-primary-a0 font-bold mb-4">Create Flashcard Set</h1>
                <form className="w-[calc(95%)] sm:w-[calc(80%)] md:w-[calc(65%)] lg:w-1/2 bg-surface-a1 p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                    {isOffline && (
                        <p className="text-lg mb-4">This set will be local only and not accessible on the online part of the website. You can make a new flashcard set in the online mode and import ones you make offline.</p>
                    )}
                    <div className="mb-4">
                        <label className="block text-2xl font-bold mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder='Enter title'
                            className="w-full p-2 mt-2 bg-surface-a2 rounded-lg"
                        />
                    </div>
                    <div className='mb-4'>
                        <label className="block text-2xl font-bold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Enter description'
                            className="w-full p-2 mt-2 bg-surface-a2 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-2xl font-bold mb-2">Questions</label>
                        <div className="flex flex-row">
                            <button
                                type="button"
                                onClick={handleOpenImport}
                                className="mt-2 bg-primary-a0 hover:bg-primary-a1 p-2 w-full rounded-lg"
                            >Import Flashcards</button>
                            {!isOffline && (
                                <button
                                    type="button"
                                    onClick={handleOpenOfflineImport}
                                    className="mt-2 ml-2 bg-primary-a0 hover:bg-primary-a1 p-2 w-full rounded-lg"
                                >Import Offline Flashcards</button>
                            )}
                        </div>
                        
                        <div className="flex flex-row justify-around mt-2">
                            <p className="text-lg font-bold">Question</p>
                            <p className="text-lg font-bold">Answer</p>
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
                                    placeholder='Enter question'
                                    className='w-1/2 p-2 mt-2 mr-1 bg-surface-a2 rounded-lg'
                                />
                                <input
                                    type="text"
                                    value={flashcard.answer}
                                    onChange={(e) => {
                                        const newFlashcards = [...flashcards];
                                        newFlashcards[index].answer = e.target.value;
                                        setFlashcards(newFlashcards);
                                    }}
                                    placeholder='Enter answer'
                                    className='w-1/2 p-2 mt-2 ml-1 bg-surface-a2 rounded-lg'
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newFlashcards = flashcards.filter((_, i) => i !== index);
                                        setFlashcards(newFlashcards);
                                    }}
                                    className="ml-2 hover:text-tonal-a4"
                                ><FaRegTrashAlt /></button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFlashcards([...flashcards, { question: '', answer: '' }])}
                            className="mt-2 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg"
                        >Add question</button>
                    </div>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg"
                    >Create Flashcard Set</button>
                </form>
            </div>
        </div>
    )
}