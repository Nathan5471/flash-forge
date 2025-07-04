import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFlashcardSet } from '../utils/FlashcardAPIHandler';
import { getDownloadedFlashcardSet } from '../utils/DownloadManager';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';
import { IoIosArrowBack } from "react-icons/io";


export default function FlashcardPage({ isOffline = false }) {
    const { id } = useParams();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                let flashcardData;
                if (isOffline) {
                    flashcardData = await getDownloadedFlashcardSet(id);
                } else {
                    flashcardData = await getFlashcardSet(id);
                }
                setFlashcardSet(flashcardData);
            } catch (error) {
                console.error('Error fetching flashcard set:', error);
                setFlashcardSet(null);
            } finally {
                setLoading(false);
            }
        }
        fetchFlashcardSet();
    }, [id, isOffline]);

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-tonal-a0 text-white">
                <Navbar isOffline={true} />
                <div className="flex items-center justify-center">
                    <p className="text-2xl">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-tonal-a0 text-white">
            <Navbar isOffline={true} />
            <div className="flex flex-col items-center justify-center">
                <div className="w-[calc(95%)] sm:w-[calc(80%)] md:w-[calc(70%)] lg:w-[calc(60%)] mt-4">
                    <Flashcard flashcardData={flashcardSet.flashCards[currentFlashcardIndex]} />
                </div>
                <div className="flex flex-row justify-between mt-4 w-[calc(95%)] sm:w-[calc(80%)] md:w-[calc(70%)] lg:w-[calc(60%)]">
                    <button
                        className={`${currentFlashcardIndex > 0 ? 'text-white' : 'text-tonal-a2'} p-2 rounded-lg bg-surface-a1 hover:bg-surface-a2 w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev - 1)}
                        disabled={currentFlashcardIndex === 0}
                    >Previous</button>
                    <p className="text-2xl">{currentFlashcardIndex + 1}/{flashcardSet.flashCards.length}</p>
                    <button
                        className={`${currentFlashcardIndex < flashcardSet.flashCards.length - 1 ? 'text-white' : 'text-tonal-a2'} p-2 rounded-lg bg-surface-a1 hover:bg-surface-a2 w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev + 1)}
                        disabled={currentFlashcardIndex >= flashcardSet.flashCards.length - 1}
                    >Next</button>
                </div>
                <div className="flex flex-row mt-2 w-[calc(95%)] sm:w-[calc(80%)] md:w-[calc(70%)] lg:w-[calc(60%)]">
                    <Link to={`${isOffline ? '/downloads' : ''}/set/${id}`} className="bg-surface-a1 hover:bg-surface-a2 p-2 rounded-lg flex text-center items-center"><IoIosArrowBack /> Back to Set</Link>
                </div>
            </div>
        </div>
    )
}