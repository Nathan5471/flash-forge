import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOverlayContext } from '../../contexts/OverlayContext';
import { getDownloadedFlashcardSet } from '../../utils/DownloadManager';
import Navbar from '../../components/offlineComponents/Navbar';
import Flashcard from '../../components/Flashcard';
import CloneSet from '../../components/offlineComponents/CloneSet';
import DeleteFlashcardSet from '../../components/offlineComponents/DeleteFlashcardSet';

export default function FlashcardSet() {
    const { id } = useParams();
    const { openOverlay } = useOverlayContext();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    
    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                const downloadedSet = getDownloadedFlashcardSet(id);
                if (downloadedSet) {
                    setFlashcardSet(downloadedSet);
                } else {
                    setFlashcardSet(null);
                }
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
                <div className="flex flex-row mb-4">
                    <Link to={`/downloads/set/${flashcardSet._id}/flashcard`} className="bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded mr-2">Flashcards</Link>
                    <Link to={`/downloads/test/${flashcardSet._id}`} className="bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded mr-2">Take Test</Link>
                </div>
                <div className="w-1/2 mb-4">
                    <Flashcard flashcardData={flashcardSet.flashCards[currentFlashcardIndex]} />
                </div>
                <div className="flex flex-row justify-between w-1/2 mb-4 gap-4">
                    <button
                        className={`${currentFlashcardIndex > 0 ? 'text-white' : 'text-gray-400'} bg-gray-700 hover:bg-gray-800 p-2 rounded-lg w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev - 1)}
                        disabled={currentFlashcardIndex === 0}
                    >Previous</button>
                    <p className="text-2xl">{currentFlashcardIndex + 1}/{flashcardSet.flashCards.length}</p>
                    <button
                        className={`${currentFlashcardIndex < flashcardSet.flashCards.length - 1 ? 'text-white' : 'text-gray-400'} bg-gray-700 hover:bg-gray-800 p-2 rounded-lg w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev + 1)}
                        disabled={currentFlashcardIndex >= flashcardSet.flashCards.length - 1}
                    >Next</button>
                </div>
                <p className="text-lg text-gray-300 text-left w-1/2">Created By: <Link to={`/downloads/user/${flashcardSet.userId._id}`} className="hover:underline">{flashcardSet.userId.username}</Link></p>
                <p className="text-lg text-gray-300 text-left w-1/2">Description: {flashcardSet.description}</p>
                <div className="flex flex-row mt-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
                        onClick={() => openOverlay(<CloneSet flashcardSet={flashcardSet} />)}
                    >Clone Set</button>
                    { flashcardSet.userId._id === 'local-user' && (
                        <Link to={`/downloads/edit/${flashcardSet._id}`} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg ml-4">Edit Flashcard Set</Link>
                    )}
                    <button
                        className="bg-red-500 hover:bg-red-600 p-2 rounded-lg ml-4"
                        onClick={() => openOverlay(<DeleteFlashcardSet id={flashcardSet._id} />)}
                    >Delete</button>
                </div>
            </div>
        </div>
    )
}