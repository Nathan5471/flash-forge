import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getFlashcardSet } from '../utils/FlashcardAPIHandler';
import { getUser } from '../utils/AuthAPIHandler';
import { getDownloadedFlashcardSet, isFlashcardSetDownloaded, downloadFlashcardSet, syncFlashcardSet } from '../utils/DownloadManager';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';
import ExportFlashcards from '../components/ExportFlashcards';
import CloneSet from '../components/CloneSet';
import DeleteFlashcardSet from '../components/DeleteFlashcardSet';
import { PiCardsDuotone, PiNotePencil, PiBookDuotone, PiShuffleDuotone, PiArrowsClockwise, PiDownloadSimpleDuotone } from "react-icons/pi";

export default function FlashcardSet({ isOffline = false }) {
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
                let flashcardData;
                if (isOffline) {
                    flashcardData = await getDownloadedFlashcardSet(id);
                } else {
                    flashcardData = await getFlashcardSet(id);
                }
                setFlashcardSet(flashcardData);
                if (isOffline) {
                    return;
                }
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
    }, [id, isOffline]);

    const handleExportFlashcards = (e) => {
        e.preventDefault();
        openOverlay(<ExportFlashcards flashcardSetData={flashcardSet} />);
    }

    const handleDeleteFlashcardSet = (e) => {
        e.preventDefault();
        openOverlay(<DeleteFlashcardSet id={id} isOffline={isOffline} />);
    }

    const handleCloneFlashcardSet = (e) => {
        e.preventDefault();
        openOverlay(<CloneSet flashcardSet={flashcardSet} isOffline={isOffline} />);
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-[#251d24] text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center">
                    <p className="text-2xl">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-[#251d24] text-white">
            <Navbar isOffline={isOffline} />
            <div className="flex flex-col items-center justify-center mt-6 w-screen">
                <h1 className="text-4xl text-[#f081e7] font-bold mb-4">{flashcardSet.title}</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2">
                    <Link to={`${isOffline ? '/downloads' : ''}/set/${flashcardSet._id}/flashcard`} className="w-full bg-[#f081e7] hover:bg-[#f390ea] text-center font-bold p-2 rounded mr-2">
                        <div className="flex flex-col items-center justify-center mb-2">
                            <PiCardsDuotone className="text-4xl sm:text-5xl md:text-6xl text-[#fbc9f5]" />
                            Flashcards
                        </div>
                    </Link>
                    <Link to={`${isOffline ? '/downloads' : ''}/test/${flashcardSet._id}`} className="w-full bg-[#f081e7] hover:bg-[#f390ea] text-center font-bold p-2 rounded mr-2">
                        <div className="flex flex-col items-center justify-center mb-2">
                            <PiNotePencil className="text-4xl sm:text-5xl md:text-6xl text-[#fbc9f5]" />
                            Take Test
                        </div>
                        
                    </Link>
                    <Link to={`${isOffline ? '/downloads' : ''}/learn/${flashcardSet._id}`} className="w-full bg-[#f081e7] hover:bg-[#f390ea] text-center font-bold p-2 rounded mr-2">
                        <div className="flex flex-col items-center justify-center mb-2">
                            <PiBookDuotone className="text-4xl sm:text-5xl md:text-6xl text-[#fbc9f5]" />
                            Learn
                        </div>
                    </Link>
                    <Link to={`${isOffline ? '/downloads' : ''}/match/${flashcardSet._id}`} className="w-full bg-[#f081e7] hover:bg-[#f390ea] text-center font-bold p-2 rounded mr-2">
                        <div className="flex flex-col items-center justify-center mb-2">
                            <PiShuffleDuotone className="text-4xl sm:text-5xl md:text-6xl text-[#fbc9f5]" />
                            Matching
                        </div>
                    </Link>
                    {!isOffline && (
                    isDownloaded ? (
                        <button
                            className="w-full bg-[#f081e7] text-center hover:bg-[#f390ea] font-bold p-2 rounded mr-2"
                            onClick={() => syncFlashcardSet(flashcardSet._id)}
                        >
                            <div className="flex flex-col items-center justify-center mb-2">
                                <PiArrowsClockwise className="text-4xl sm:text-5xl md:text-6xl text-[#fbc9f5]" />
                                Sync Set
                            </div>
                        </button>
                    ) : (
                        <button
                            className="w-full bg-[#f081e7] text-center hover:bg-[#f390ea] font-bold p-2 rounded mr-2"
                            onClick={() => {
                                downloadFlashcardSet(flashcardSet._id)
                                setIsDownloaded(true);
                            }}
                        >
                            <div className="flex flex-col items-center justify-center mb-2">
                                <PiDownloadSimpleDuotone className="text-4xl sm:text-5xl md:text-6xl text-[#fbc9f5]" />
                                Download Set
                            </div>
                            
                        </button>
                    ))}
                </div>
                <div className='w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2 mb-4'>
                    <Flashcard flashcardData={flashcardSet.flashCards[currentFlashcardIndex]} />
                </div>
                <div className="flex flex-row justify-between w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2 mb-4 gap-4">
                    <button
                        className={`${currentFlashcardIndex > 0 ? 'text-white' : 'text-[#4f484e]'} bg-[#282828] p-2 rounded-lg hover:bg-[#3f3f3f] w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev - 1)}
                        disabled={currentFlashcardIndex === 0}
                    >Previous</button>
                    <p className="text-2xl">{currentFlashcardIndex + 1}/{flashcardSet.flashCards.length}</p>
                    <button
                        className={`${currentFlashcardIndex < flashcardSet.flashCards.length - 1 ? 'text-white' : 'text-[#4f484e]'} bg-[#282828] p-2 rounded-lg hover:bg-[#3f3f3f] w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev + 1)}
                        disabled={currentFlashcardIndex >= flashcardSet.flashCards.length - 1}
                    >Next</button>
                </div>
                <p className="text-lg text-[#969295] text-left w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2">Created By: <Link to={`${isOffline ? '/downloads' : ''}/user/${flashcardSet.userId._id}`} className="hover:underline">{flashcardSet.userId.username}</Link></p>
                <p className="text-lg text-[#969295] text-left w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2">Description: {flashcardSet.description}</p>
                <div className="flex flex-row">
                    <button
                        className="mt-4 bg-[#f081e7] hover:bg-[#f390ea] p-2 rounded-lg"
                        onClick={handleExportFlashcards}
                    >Export Flashcards</button>
                    
                    { isOffline ? (
                        <>
                            <button
                                className="mt-4 bg-[#f081e7] hover:bg-[#f390ea] p-2 rounded-lg ml-4"
                                onClick={handleCloneFlashcardSet}
                            >Clone Flashcard Set</button>
                            {flashcardSet.userId._id === 'local-user' && (
                                <Link to={`/downloads/edit/${flashcardSet._id}`} className="mt-4 bg-[#f081e7] hover:bg-[#f390ea] p-2 rounded-lg ml-4">
                                    Edit Flashcard Set
                                </Link>
                            )}
                            <button
                                className="mt-4 bg-red-500 hover:bg-red-600 p-2 rounded-lg ml-4"
                                onClick={handleDeleteFlashcardSet}
                            >Delete</button>
                        </>
                    ) : (
                        <>
                            {user && (
                                <button
                                    className="mt-4 bg-[#f081e7] hover:bg-[#f390ea] p-2 rounded-lg ml-4"
                                    onClick={handleCloneFlashcardSet}
                                >Clone Flashcard Set</button>
                            )}
                            {flashcardSet.userId._id === user?._id && (
                            <>
                                <Link to={`/edit/${flashcardSet._id}`} className="mt-4 bg-[#f081e7] hover:bg-[#f390ea] p-2 rounded-lg ml-4">
                                    Edit Flashcard Set
                                </Link>
                                <button
                                    className="mt-4 bg-red-500 hover:bg-red-600 p-2 rounded-lg ml-4"
                                    onClick={handleDeleteFlashcardSet}
                                >Delete</button>
                            </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}