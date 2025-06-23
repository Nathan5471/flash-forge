import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fuse from 'fuse.js';
import { getUserDownloadedFlashcardSets } from '../../utils/DownloadManager';
import SortSets from '../../utils/SortSets';
import Navbar from '../../components/offlineComponents/Navbar';
import SetDisplay from '../../components/SetDisplay';

export default function User() {
    const { userId } = useParams();
    const [username, setUsername] = useState(null);
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [displayedSets, setDisplayedSets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOption, setSortOption] = useState("date,false");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserFlashcardSets = async () => {
            try {
                const sets = getUserDownloadedFlashcardSets(userId);
                console.log('Fetched sets:', sets);
                if (sets.length > 0) {
                    setUsername(sets[0].data.userId.username);
                }
                setFlashcardSets(sets.map(set => set.data));
            } catch (error) {
                console.error('Error fetching user flashcard sets:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchUserFlashcardSets();
    }, [userId]);

    useEffect(() => {
        const handleSearch = () => {
            const fuseOptions = {
                keys: [{ name: 'title', weight: 0.7 }, { name: 'description', weight: 0.3 }],
                includeScore: true,
                threshold: 0.3,
            }
            const fuseInstance = new fuse(flashcardSets, fuseOptions);
            const results = fuseInstance.search(searchQuery);
            const sortedResults = results.sort((a, b) => a.score - b.score).map(result => result.item);
            setDisplayedSets(sortedResults);
        }
        if (searchQuery.trim()) {
            handleSearch();
        }
    }, [searchQuery, flashcardSets]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            const [sortBy, ascending] = sortOption.split(',');
            setDisplayedSets(SortSets(flashcardSets, sortBy, ascending === 'true'));
        }
    }, [flashcardSets, searchQuery, sortOption]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="text-4xl font-bolt text-center mt-6">{username}'s Flashcard Sets</div>
            <div className="flex flex-row justify-center mt-4">
                <input
                    type="text"
                    placeholder="Search sets..."
                    className="bg-gray-700 p-2 rounded w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <select className="bg-gray-700 p-2 rounded ml-3" value={sortOption} onChange={(e) => handleSortChange(e)}>
                    <option value="date,false">Sort by Date (Newest)</option>
                    <option value="date,true">Sort by Date (Oldest)</option>
                    <option value="title,true">Sort by Title (A-Z)</option>
                    <option value="title,false">Sort by Title (Z-A)</option>
                    <option value="flashcardCount,false">Sort by Flashcard Count (High to Low)</option>
                    <option value="flashcardCount,true">Sort by Flashcard Count (Low to High)</option>
                </select>
            </div>
            {displayedSets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-4">
                    {displayedSets.map((set) => (
                        <SetDisplay key={set._id} flashcardSet={set} isOffline={true} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    {flashcardSets.length === 0 ? (
                        <p className="text-2xl">This user has no sets</p>
                    ) : (
                        <p className="text-2xl">No sets found for "{searchQuery}"</p>
                    )}
                </div>
            )}
        </div>
    )
}