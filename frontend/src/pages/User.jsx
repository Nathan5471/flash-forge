import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUsername } from '../utils/AuthAPIHandler';
import { getUserFlashcardSets } from '../utils/FlashcardAPIHandler';
import Navbar from '../components/Navbar';
import SetDisplay from '../components/SetDisplay';

export default function User() {
    const { userId } = useParams();
    const [username, setUsername] = useState(null);
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserFlashcardSets = async () => {
            try {
                const userData = await getUsername(userId);
                setUsername(userData.username);
                const sets = await getUserFlashcardSets(userId);
                setFlashcardSets(sets);
            } catch (error) {
                console.error('Error fetching user flashcard sets:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserFlashcardSets();
    }, [userId]);

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
            <h1 className="text-4xl font-bold text-center mt-6">{username}'s Flashcard Sets</h1>
            {flashcardSets.length > 0 ? (
                <div className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {flashcardSets.map((set) => (
                        <SetDisplay key={set._id} flashcardSet={set} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-2xl">This user has no sets</p>
                </div>
            )}
        </div>
    )
}