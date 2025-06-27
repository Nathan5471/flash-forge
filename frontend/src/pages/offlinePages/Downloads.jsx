import React, { useEffect, useState } from 'react';
import { getDownloadedFlashcardSets } from '../../utils/DownloadManager';
import Navbar from '../../components/Navbar';
import SetDisplay from '../../components/SetDisplay';

export default function Downloads() {
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDownloadedFlashcards = async () => {
            try {
                const downloadedSets = await getDownloadedFlashcardSets();
                setFlashcards(downloadedSets);
            } catch (error) {
                console.error('Error fetching downloaded flashcards:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchDownloadedFlashcards();
    }, []);

    if (loading) {
        return <div className="bg-tonal-a0 h-screen flex flex-col items-center justify-center text-white">
        <Navbar isOffline={true} />
            <p className="text-lg">Loading...</p>
        </div>
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-tonal-a0 text-white">
            <Navbar isOffline={true} />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-4">
                {flashcards.length > 0 ? (
                    flashcards.map((flashcardSet) => (
                        <SetDisplay key={flashcardSet.data._id} flashcardSet={flashcardSet.data} isOffline={true} />
                    ))
                ) : (
                    <div className="col-span-full text-center">
                        <p className="text-lg">No downloaded flashcards found.</p>
                    </div>
                )}
            </div>
        </div>
    )
}