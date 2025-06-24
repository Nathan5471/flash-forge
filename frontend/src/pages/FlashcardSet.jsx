import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getFlashcardSet } from '../utils/FlashcardAPIHandler';
import { getUser } from '../utils/AuthAPIHandler';
import { isFlashcardSetDownloaded, downloadFlashcardSet, syncFlashcardSet } from '../utils/DownloadManager';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';
import ExportFlashcards from '../components/ExportFlashcards';
import CloneSet from '../components/CloneSet';
import DeleteFlashcardSet from '../components/DeleteFlashcardSet';

export default function FlashcardSet() {
    const { openOverlay } = useOverlayContext();
    const { id } = useParams();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [isDownloaded, setIsDownloaded] = useState(false);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                const flashcardData = await getFlashcardSet(id);
                setFlashcardSet(flashcardData);
                setIsDownloaded(isFlashcardSetDownloaded(id));
                const userData = await getUser();
                if (userData) {
                    setUser(userData.user);
                } else {
                    setUser(null);
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

    const handleExportFlashcards = (e) => {
        e.preventDefault();
        openOverlay(<ExportFlashcards flashcardSetData={flashcardSet} />);
    }

    const handleDeleteFlashcardSet = (e) => {
        e.preventDefault();
        openOverlay(<DeleteFlashcardSet id={id} />);
    }

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
                    <Link to={`/set/${flashcardSet._id}/flashcard`} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg mr-4">Flashcards</Link>
                    <Link to={`/test/${flashcardSet._id}`} className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg mr-4">Take Test</Link>
                    { isDownloaded ? (
                        <button
                            className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600"
                            onClick={() => syncFlashcardSet(flashcardSet._id)}
                        >Sync Set</button>
                    ) : (
                        <button
                            className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600"
                            onClick={() => {
                                downloadFlashcardSet(flashcardSet._id)
                                setIsDownloaded(true);
                            }}
                        >Download Set</button>
                    )}
                </div>
                <div className='w-1/2 mb-4'>
                    <Flashcard flashcardData={flashcardSet.flashCards[currentFlashcardIndex]} />
                </div>
                <div className="flex flex-row justify-between w-1/2 mb-4 gap-4">
                    <button
                        className={`${currentFlashcardIndex > 0 ? 'text-white' : 'text-gray-400'} bg-gray-700 p-2 rounded-lg hover:bg-gray-800 w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev - 1)}
                        disabled={currentFlashcardIndex === 0}
                    >Previous</button>
                    <p className="text-2xl">{currentFlashcardIndex + 1}/{flashcardSet.flashCards.length}</p>
                    <button
                        className={`${currentFlashcardIndex < flashcardSet.flashCards.length - 1 ? 'text-white' : 'text-gray-400'} bg-gray-700 p-2 rounded-lg hover:bg-gray-800 w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev + 1)}
                        disabled={currentFlashcardIndex >= flashcardSet.flashCards.length - 1}
                    >Next</button>
                </div>
                <p className="text-lg text-gray-300 text-left w-1/2">Created By: <Link to={`/user/${flashcardSet.userId._id}`} className="hover:underline">{flashcardSet.userId.username}</Link></p>
                <p className="text-lg text-gray-300 text-left w-1/2">Description: {flashcardSet.description}</p>
                <div className="flex flex-row">
                    <button
                        className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                        onClick={handleExportFlashcards}
                    >Export Flashcards</button>
                    {user && (
                        <button
                            className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 ml-4"
                            onClick={() => openOverlay(<CloneSet flashcardSet={flashcardSet} />)}
                        >Clone Flashcard Set</button>
                    )}
                    {flashcardSet.userId._id === user?._id && (
                        <>
                            <Link to={`/edit/${flashcardSet._id}`} className="mt-4 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 ml-4">
                                Edit Flashcard Set
                            </Link>
                            <button
                                className="mt-4 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 ml-4"
                                onClick={handleDeleteFlashcardSet}
                            >Delete</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}