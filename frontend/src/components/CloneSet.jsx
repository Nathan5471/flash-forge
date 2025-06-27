import React, { useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';
import { cloneFlashcardSet } from '../utils/FlashcardAPIHandler';
import { createOfflineClone } from '../utils/DownloadManager';
import { getUser } from '../utils/AuthAPIHandler';

export default function CloneSet({ flashcardSet, isOffline = false }) {
    const { closeOverlay } = useOverlayContext();
    const [newTitle, setNewTitle] = useState('clone of ' + flashcardSet.title);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let newFlashcardSet;
            if (isOffline) {
                newFlashcardSet = await createOfflineClone(flashcardSet._id, newTitle);
            } else {
                const user = await getUser();
                if (!user) {
                    throw new Error('User not authenticated');
                }
                newFlashcardSet = await cloneFlashcardSet(flashcardSet._id, newTitle);
            }
            window.location.href = `${isOffline ? '/downloads' : ''}/set/${newFlashcardSet.flashcardSet._id}`;
            closeOverlay();
        } catch (error) {
            console.error('Error cloning flashcard set:', error);
        }
        setNewTitle('');
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }
    
    return (
        <div className="flex flex-col">
            <h1 className="text-3xl text-primary-a0 font-bold text-center mb-4">Clone Flashcard Set</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <label className="mb-2 text-xl">New Title:</label>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="New Title..."
                    className="mb-4 p-2 bg-surface-a2 rounded w-full"
                    required
                />
                <div className="flex flex-row w-full">
                    <button type="submit" className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg mr-2 w-1/2">Clone</button>
                    <button onClick={handleCancel} className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-1/2">Cancel</button>
                </div>
            </form>
        </div>
    )
}