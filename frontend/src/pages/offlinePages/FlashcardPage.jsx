import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDownloadedFlashcardSet } from '../../utils/DownloadManager';
import Navbar from '../../components/offlineComponents/Navbar';
import Flashcard from '../../components/Flashcard';
import { IoIosArrowBack } from 'react-icons/io';

export default function FlashcardPage() {
    const { id } = useParams();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

    useEffect(() => {
        const fetchFlashcardSet = () => {
            try {
                const flashcardData = getDownloadedFlashcardSet(id);
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
            <div className="flex flex-col items-center justify-center">
                <div className="w-[calc(60%)] mt-4">
                    <Flashcard flashcardData={flashcardSet.flashCards[currentFlashcardIndex]} />
                </div>
                <div className="flex flex-row justify-between mt-4 w-[calc(60%)]">
                    <button
                        className={`${currentFlashcardIndex > 0 ? 'text-white' : 'text-gray-400'} p-2 rounded-lg bg-gray-700 hover:bg-gray-800 w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev - 1)}
                        disabled={currentFlashcardIndex === 0}
                    >Previous</button>
                    <p className="text-2xl">{currentFlashcardIndex + 1}/{flashcardSet.flashCards.length}</p>
                    <button
                        className={`${currentFlashcardIndex < flashcardSet.flashCards.length - 1 ? 'text-white' : 'text-gray-400'} p-2 rounded-lg bg-gray-700 hover:bg-gray-800 w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev + 1)}
                        disabled={currentFlashcardIndex >= flashcardSet.flashCards.length - 1}
                    >Next</button>
                </div>
                <div className="flex flex-row mt-2 w-[calc(60%)]">
                    <Link to={`/downloads/set/${id}`} className="bg-gray-700 hover:bg-gray-800 p-2 rounded-lg flex text-center items-center"><IoIosArrowBack className="mr-2" />Back to Set</Link>
                </div>
            </div>
        </div>
    )
}