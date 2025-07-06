import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getFlashcardSet, getFlashcardSetRating, postComment, getComments, deleteComment } from '../utils/FlashcardAPIHandler';
import { getUser, checkIsTeacher } from '../utils/AuthAPIHandler';
import { getDownloadedFlashcardSet, isFlashcardSetDownloaded, downloadFlashcardSet, syncFlashcardSet } from '../utils/DownloadManager';
import Navbar from '../components/Navbar';
import Flashcard from '../components/Flashcard';
import ExportFlashcards from '../components/ExportFlashcards';
import CloneSet from '../components/CloneSet';
import DeleteFlashcardSet from '../components/DeleteFlashcardSet';
import Assign from '../components/Assign';
import Rate from '../components/Rate';
import { PiCardsDuotone, PiNotePencil, PiBookDuotone, PiShuffleDuotone, PiArrowsClockwise, PiDownloadSimpleDuotone } from "react-icons/pi";

export default function FlashcardSet({ isOffline = false }) {
    const { openOverlay } = useOverlayContext();
    const { id } = useParams();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [canFlip, setCanFlip] = useState(true);
    const [rating, setRating] = useState({ rating: 0, ratingsCount: 0 });
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
    const [isDownloaded, setIsDownloaded] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);

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
                    setIsTeacher(await checkIsTeacher());
                } else {
                    setUser(null);
                }
                if (!isOffline) {
                    try {
                        const flashcardSetRating = await getFlashcardSetRating(id);
                        setRating(flashcardSetRating);
                    } catch (error) {
                        console.error('Error fetching flashcard set rating:', error);
                        setRating({ rating: 0, ratingsCount: 0 });
                    }
                    try {
                        const flashcardSetComments = await getComments(id);
                        setComments(flashcardSetComments.comments || []);
                    } catch (error) {
                        console.error('Error fetching flashcard set comments:', error);
                        setComments([]);
                    }
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

    const handleAssignFlashcardSet = (e) => {
        e.preventDefault();
        openOverlay(<Assign flashcardSetId={flashcardSet._id} />);
    }

    const handleRateFlashcardSet = (e) => {
        e.preventDefault();
        openOverlay(<Rate flashcardSetId={flashcardSet._id} />);
    }

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            return;
        }
        try {
            const commentData = await postComment(flashcardSet._id, newComment);
            setComments(commentData.comments);
            setNewComment('');
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    }

    const handleDeleteComment = async (e, commentId) => {
        e.preventDefault();
        try {
            await deleteComment(flashcardSet._id, commentId);
            setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-tonal-a0 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center">
                    <p className="text-2xl">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-tonal-a0 text-white">
            <Navbar isOffline={isOffline} />
            <div className="flex flex-col items-center justify-center mt-6 w-screen">
                <h1 className="text-4xl text-primary-a0 font-bold mb-4">{flashcardSet.title}</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4 w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2">
                    <Link to={`${isOffline ? '/downloads' : ''}/set/${flashcardSet._id}/flashcard`} className="w-full bg-primary-a0 hover:bg-primary-a1 text-center font-bold p-2 rounded mr-2">
                        <div className="flex flex-col items-center justify-center mb-2">
                            <PiCardsDuotone className="text-4xl sm:text-5xl md:text-6xl text-primary-a5" />
                            Flashcards
                        </div>
                    </Link>
                    <Link to={`${isOffline ? '/downloads' : ''}/test/${flashcardSet._id}`} className="w-full bg-primary-a0 hover:bg-primary-a1 text-center font-bold p-2 rounded mr-2">
                        <div className="flex flex-col items-center justify-center mb-2">
                            <PiNotePencil className="text-4xl sm:text-5xl md:text-6xl text-primary-a5" />
                            Take Test
                        </div>
                        
                    </Link>
                    <Link to={`${isOffline ? '/downloads' : ''}/learn/${flashcardSet._id}`} className="w-full bg-primary-a0 hover:bg-primary-a1 text-center font-bold p-2 rounded mr-2">
                        <div className="flex flex-col items-center justify-center mb-2">
                            <PiBookDuotone className="text-4xl sm:text-5xl md:text-6xl text-primary-a5" />
                            Learn
                        </div>
                    </Link>
                    <Link to={`${isOffline ? '/downloads' : ''}/match/${flashcardSet._id}`} className="w-full bg-primary-a0 hover:bg-primary-a1] text-center font-bold p-2 rounded mr-2">
                        <div className="flex flex-col items-center justify-center mb-2">
                            <PiShuffleDuotone className="text-4xl sm:text-5xl md:text-6xl text-primary-a5" />
                            Matching
                        </div>
                    </Link>
                    {!isOffline && (
                    isDownloaded ? (
                        <button
                            className="w-full bg-primary-a0 text-center hover:bg-primary-a1 font-bold p-2 rounded mr-2"
                            onClick={() => syncFlashcardSet(flashcardSet._id)}
                        >
                            <div className="flex flex-col items-center justify-center mb-2">
                                <PiArrowsClockwise className="text-4xl sm:text-5xl md:text-6xl text-[#fbc9f5]" />
                                Sync Set
                            </div>
                        </button>
                    ) : (
                        <button
                            className="w-full bg-primary-a0 text-center hover:bg-primary-a1 font-bold p-2 rounded mr-2"
                            onClick={() => {
                                downloadFlashcardSet(flashcardSet._id)
                                setIsDownloaded(true);
                            }}
                        >
                            <div className="flex flex-col items-center justify-center mb-2">
                                <PiDownloadSimpleDuotone className="text-4xl sm:text-5xl md:text-6xl text-primary-a5" />
                                Download Set
                            </div>
                            
                        </button>
                    ))}
                </div>
                <div className='w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2 mb-4'>
                    <Flashcard flashcardData={flashcardSet.flashCards[currentFlashcardIndex]} canFlip={canFlip} />
                </div>
                <div className="flex flex-row justify-between w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2 mb-4 gap-4">
                    <button
                        className={`${currentFlashcardIndex > 0 ? 'text-white' : 'text-tonal-a2'} bg-surface-a1 p-2 rounded-lg hover:bg-surface-a2 w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev - 1)}
                        disabled={currentFlashcardIndex === 0}
                    >Previous</button>
                    <p className="text-2xl">{currentFlashcardIndex + 1}/{flashcardSet.flashCards.length}</p>
                    <button
                        className={`${currentFlashcardIndex < flashcardSet.flashCards.length - 1 ? 'text-white' : 'text-tonal-a2'} bg-surface-a1 p-2 rounded-lg hover:bg-surface-a2 w-[calc(25%)]`}
                        onClick={() => setCurrentFlashcardIndex(prev => prev + 1)}
                        disabled={currentFlashcardIndex >= flashcardSet.flashCards.length - 1}
                    >Next</button>
                </div>
                <p className="text-lg text-tonal-a5 text-left w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2">Created By: <Link to={`${isOffline ? '/downloads' : ''}/user/${flashcardSet.userId._id}`} className="hover:underline">{flashcardSet.userId.username}</Link></p>
                <p className="text-lg text-tonal-a5 text-left w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2">Description: {flashcardSet.description}</p>
                {!isOffline && (<p className="text-lg text-tonal-a5 text-left w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2">Rating: {rating.rating} ({rating.ratingsCount} ratings)</p>)}
                <div className="flex flex-row mb-4">
                    <button
                        className="mt-4 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg"
                        onClick={handleExportFlashcards}
                    >Export Flashcards</button>
                    
                    { isOffline ? (
                        <>
                            <button
                                className="mt-4 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg ml-4"
                                onClick={handleCloneFlashcardSet}
                            >Clone Flashcard Set</button>
                            {flashcardSet.userId._id === 'local-user' && (
                                <Link to={`/downloads/edit/${flashcardSet._id}`} className="mt-4 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg ml-4">
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
                                <>
                                    <button
                                        className="mt-4 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg ml-4"
                                        onClick={handleCloneFlashcardSet}
                                    >Clone Flashcard Set</button>
                                    <button
                                        className="mt-4 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg ml-4"
                                        onClick={handleRateFlashcardSet}
                                    >Rate</button>
                                </>
                            )}
                            {isTeacher && (
                                <button
                                    className="mt-4 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg ml-4"
                                    onClick={handleAssignFlashcardSet}
                                >Assign Set</button>
                            )}
                            {flashcardSet.userId._id === user?._id && (
                            <>
                                <Link to={`/edit/${flashcardSet._id}`} className="mt-4 bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg ml-4">
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
                {!isOffline && (
                    <div className="w-[calc(95%)] sm:w-[calc(80%)] md:w-3/4 lg:w-1/2 mb-4">
                        <h2 className="text-2xl font-bold mb-4">Comments</h2>
                        {user && (
                            <div className="flex flex-row mb-4">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handlePostComment(e);
                                        }
                                    }}
                                    onFocus={() => setCanFlip(false)}
                                    onBlur={() => setCanFlip(true)}
                                    className="flex p-2 rounded-lg w-full mr-2 bg-surface-a2"
                                    placeholder="Add a comment..."
                                />
                                <button
                                    onClick={handlePostComment}
                                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg"
                                >Post</button>
                            </div>
                        )}
                        <div className="max-h-60 overflow-y-auto">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment._id} className="bg-surface-a2 p-4 rounded-lg mb-2 w-full">
                                        <div className="flex flex-row justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-lg">{comment.comment}</p>
                                            <p className="text-sm text-surface-a5">Posted by <Link to={`/user/${comment.userId._id}`} className="hover:underline">{comment.userId.username}</Link> at {new Date(comment.createdAt).toLocaleString()}</p>
                                        </div>
                                        {user && user?._id === comment.userId._id && (
                                            <button
                                                className="bg-red-500 hover:bg-red-600 p-2 rounded-lg ml-4"
                                                onClick={(e) => handleDeleteComment(e, comment._id)}
                                            >Delete</button>
                                        )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-lg text-tonal-a5">No comments yet. Be the first to comment!</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}