import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchFlashcardSets } from '../utils/FlashcardAPIHandler';
import Navbar from '../components/Navbar';
import SetDisplay from '../components/SetDisplay';

export default function Search() {
    const { searchTerm } = useParams();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcardSets = async () => {
            try {
                const flashcardData = await searchFlashcardSets(searchTerm, 0, 10);
                setFlashcardSets(flashcardData);
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
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex flex-col justify-center mt-4">
                <h1 className="text-2xl font-bold text-center mb-4">Search Results for "{searchTerm}"</h1>
                { flashcardSets.length > 0 ? (
                    <div className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {flashcardSets.map((set) => (
                            <SetDisplay key={set._id} flashcardSet={set} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-xl font-semibold">No flashcard sets found</h2>
                        <p className="text-gray-400">Try searching for something else.</p>
                    </div>
                )}
            </div>
        </div>
    )
}