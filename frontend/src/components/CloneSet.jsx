import React, { useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';
import { cloneFlashcardSet } from '../utils/FlashcardAPIHandler';
import { getUser } from '../utils/AuthAPIHandler';

export default function CloneSet({ flashcardSet }) {
    const { closeOverlay } = useOverlayContext();
    const [newTitle, setNewTitle] = useState('clone of ' + flashcardSet.title);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await getUser();
            if (!user) {
                throw new Error('User not authenticated');
            }
            const newFlashcardSet = await cloneFlashcardSet(flashcardSet._id, newTitle);
            window.location.href = `/set/${newFlashcardSet.flashcardSet._id}`;
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
            <h1 className="text-3xl mb-4 text-center">Clone Flashcard Set</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <label className="mb-2 text-lg">New Title:</label>
                <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="New Title..."
                    className="mb-4 p-2 bg-gray-600 rounded w-full"
                    required
                />
                <div className="flex flex-row w-full">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 py-2 px-6 rounded-lg mr-2 w-[calc(50%)]">Clone</button>
                    <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 py-2 px-6 rounded-lg w-[calc(50%)]">Cancel</button>
                </div>
            </form>
        </div>
    )
}