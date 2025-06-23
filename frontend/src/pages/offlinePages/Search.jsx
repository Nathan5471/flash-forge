import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchDownloadedFlashcardSets } from '../../utils/DownloadManager';
import Navbar from '../../components/offlineComponents/Navbar';
import SetDisplay from '../../components/SetDisplay';

export default function Search() {
    const { searchTerm } = useParams();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcardSets = async () => {
            setFlashcardSets([]);
            try {
                const flashcardData = searchDownloadedFlashcardSets(searchTerm);
                setFlashcardSets(flashcardData.map(set => set.data));
            } catch (error) {
                console.error('Error fetching flashcard sets:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFlashcardSets();
    }, [searchTerm]);

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar />
                <div className="flex justify-center items-center h-full">
                    <h1 className="text-2xl font-bold">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex flex-col justify-center mt-4">
                <h1 className="text-2xl font-bold text-center mb-4">Search results for "{searchTerm}"</h1>
                { flashcardSets.length > 0 ? (
                    <>
                        <div clsasName="flex flex-row ml-auto mr-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                                {flashcardSets.map((set) => (
                                    <SetDisplay key={set._id} flashcardSet={set} isOffline={true}/>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-xl font-semibold">No results found</h2>
                        <p className="text-gray-400">Try searching for something else.</p>
                    </div>
                )}
            </div>
        </div>
    )
}