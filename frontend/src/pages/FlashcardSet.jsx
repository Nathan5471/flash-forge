import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFlashcardSet } from '../utils/FlashcardAPIHandler';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';

export default function FlashcardSet() {
    const { id } = useParams();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                const flashcardData = await getFlashcardSet(id);
                setFlashcardSet(flashcardData);
            } catch (error) {
                console.error('Error fetching flashcard set:', error);
                setFlashcardSet(null);
            } finally {
                setLoading(false);
            }
        }
        fetchFlashcardSet();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar />
                <div className="flex items-center justify-center">
                    <p className="text-2xl">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center mt-6 w-screen">
                <h1 className="text-4xl font-bold mb-4">{flashcardSet.title}</h1>
                <div className='w-1/2 aspect-[2/1] mb-4'>
                    <Flashcard flashcardData={flashcardSet.flashCards[currentFlashcardIndex]} />
                </div>
                <div className="grid grid-cols-3 w-1/2 mb-4 gap-4">
                    <div>
                        {currentFlashcardIndex > 0 && (
                            <button
                                className="bg-gray-700 p-2 rounded-lg hover:bg-gray-800 w-[calc(50%)]"
                                onClick={() => setCurrentFlashcardIndex(prev => prev - 1)}
                            >Previous</button>
                        )}
                    </div>
                    <p className="text-2xl">{currentFlashcardIndex + 1}/{flashcardSet.flashCards.length}</p>
                    <div>
                        {currentFlashcardIndex < flashcardSet.flashCards.length - 1 && (
                            <button
                                className="bg-gray-700 p-2 rounded-lg hover:bg-gray-800 w-[calc(50%)]"
                                onClick={() => setCurrentFlashcardIndex(prev => prev + 1)}
                            >Next</button>
                        )}
                    </div>
                </div>
                <p className="text-lg text-gray-300 text-left w-1/2">Created By: {flashcardSet.userId.username}</p>
                <p className="text-lg text-gray-300 text-left w-1/2">Description: {flashcardSet.description}</p>
            </div>
        </div>
    )
}