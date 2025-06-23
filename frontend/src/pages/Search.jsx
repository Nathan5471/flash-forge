import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchFlashcardSets } from '../utils/FlashcardAPIHandler';
import Navbar from '../components/Navbar';
import SetDisplay from '../components/SetDisplay';

export default function Search() {
    const { searchTerm } = useParams();
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(100);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFlashcardSets = async () => {
            setFlashcardSets([]);
            try {
                const flashcardData = await searchFlashcardSets(searchTerm, page, limit);
                setFlashcardSets(flashcardData.searchResults);
                setTotalAmount(flashcardData.totalResults);
            } catch (error) {
                console.error('Error fetching flashcard sets:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFlashcardSets();
    }, [searchTerm, page, limit]);

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar />
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex flex-col justify-center mt-4">
                <h1 className="text-2xl font-bold text-center mb-4">Search Results for "{searchTerm}"</h1>
                { flashcardSets.length > 0 ? (
                    <>
                        <div className="flex flex-row ml-auto mr-2">
                            <label className="mr-2 text-lg">Search result per page: </label>
                            <select className="bg-gray-700 text-white p-2 rounded" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                        </div>
                        <div className="grid gird-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                            {flashcardSets.map((set) => (
                                <SetDisplay key={set._id} flashcardSet={set} />
                            ))}
                        </div>
                        { totalAmount > limit && (
                            <div className="mb-4 ml-4">
                                <button className={`${page > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 cursor-not-allowed'} text-white font-bold py-2 px-4 rounded mr-2`} onClick={() => setPage(page - 1)} disabled={page <= 0}>Previous</button>
                                <button className={`${totalAmount > (page + 1) * limit ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 cursor-not-allowed'} text-white font-bold py-2 px-4 rounded`} onClick={() => setPage(page + 1)} disabled={totalAmount <= (page + 1) * limit}>Next</button>
                            </div>
                        )}
                    </>
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