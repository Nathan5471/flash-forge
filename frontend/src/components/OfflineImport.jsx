import React, { useEffect, useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getUserDownloadedFlashcardSets } from '../utils/DownloadManager';

export default function OfflineImport({ onImport }) {
    const { closeOverlay } = useOverlayContext();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchDownloadedSets = async () => {
            try {
                const sets = getUserDownloadedFlashcardSets('local-user')
                setFlashcardSets(sets.map(set => set.data));
            } catch (error) {
                console.error('Error fetching downloaded flashcard sets:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDownloadedSets();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const handleImport = (e, index) => {
        e.preventDefault();
        const selectedSet = flashcardSets[index];
        if (selectedSet && selectedSet.flashCards) {
            onImport(selectedSet.flashCards);
            closeOverlay();
        } else {
            console.error('Selected flashcard set is invalid or empty.');
            alert('Selected flashcard set is invalid or empty.');
        }
    }

    const handleClose = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl text-primary-a0 font-bold mb-2 text-center">Import Offline Flashcards</h1>
            <p className="text-lg text-center mb-4">These are flashcards you made in offline mode</p>
            { flashcardSets.length > 0 ? (
                flashcardSets.map((set, index) => (
                    <div key={index} className="flex flex-row mb-3 p-4 bg-gray-600 rounded">
                        <div className="flex flex-col">
                            <h2 className="text-lg">{set.title}</h2>
                            <p className="text-sm text-gray-400">{set.flashCards.length} Flashcards</p>
                        </div>
                        <button
                            onClick={(e) => handleImport(e, index)}
                            className="ml-auto bg-primary-a0 hover:bg-primary-a1 px-4 py-2 rounded-lg"
                        >Import</button>
                    </div>
                ))
            ) : (
                <div className="text-center">
                    <p className="text-lg">No offline flashcard sets found.</p>
                </div>
            )}
            <button
                onClick={handleClose}
                className="mt-4 bg-surface-a2 hover:bg-surface-a3 px-4 py-2 rounded-lg"
            >Close</button>
        </div>
    )
}