import React, { useEffect, useState } from 'react';
import { deleteFlashcardSet, getFlashcardSet } from '../utils/FlashcardAPIHandler';
import { deleteDownloadedFlashcardSet, getDownloadedFlashcardSet } from '../utils/DownloadManager'
import { getUser } from '../utils/AuthAPIHandler';
import { useOverlayContext } from '../contexts/OverlayContext';

export default function DeleteFlashcardSet({ id, isOffline = false }) {
    const { closeOverlay } = useOverlayContext();
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                let data;
                if (isOffline) {
                    data = await getDownloadedFlashcardSet(id);
                } else {
                    data = await getFlashcardSet(id);
                    const userData = await getUser();
                    if (data.userId._id !== userData.user._id) {
                        closeOverlay();
                        return;
                    }
                }
                setTitle(data.title);
            } catch (error) {
                console.error('Error fetching flashcard set:', error);
                setError('Failed to fetch flashcard set');
            } finally {
                setLoading(false);
            }
        }
        fetchFlashcardSet();
    }, [id, closeOverlay, isOffline]);

    const handleDelete = async () => {
        try {
            if (isOffline) {
                await deleteDownloadedFlashcardSet(id);
            } else {
                await deleteFlashcardSet(id);
            }
            closeOverlay();
            window.location.href = isOffline ? '/downloads' : '/';
        } catch (error) {
            console.error('Error deleting flashcard set:', error);
            setError(error.message || 'Failed to delete flashcard set');
        }
    }

    const handleCancel = () => {
        closeOverlay();
    }

    if (loading) {
        return (
            <div className="flex flex-col w-80">
                <p className="text-2xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-80">
            <h1 className="text-3xl mb-4 text-center">Delete {isOffline ? 'Offline ' : ''}Flashcard Set</h1>
            { isOffline ? (
                <p className="text-red-500 mb-4 text-center">This action can't be undone and you can only reinstall when you are online. Are you sure you would like to delete {title}?</p>
            ) : (
                <p className="text-red-500 mb-4 text-center">This action can not be undone, are you sure you would like to delete {title}?</p>
            )}
            <p className="text-red-500 mb-4 text-center">{error}</p>
            <div className="flex flex-row w-full">
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 py-2 px-6 rounded-lg text-white mr-2 w-[calc(50%)]">Delete</button>
                <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 py-2 px-6 rounded-lg text-white w-[calc(50%)]">Cancel</button>
            </div>
        </div>
    )
}