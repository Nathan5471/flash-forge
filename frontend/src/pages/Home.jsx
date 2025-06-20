import React, { useEffect, useState } from 'react'
import { getUser } from '../utils/AuthAPIHandler'
import { getRecentlyViewedFlashcardSets } from '../utils/FlashcardAPIHandler'
import Navbar from '../components/Navbar'
import SetDisplay from '../components/SetDisplay'

export default function Home() {
    const [user, setUser] = useState(null)
    const [recentlyViewed, setRecentlyViewed] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            try {
                const userData = await getUser()
                setUser(userData.user)
                if (userData) {
                    const recentSets = await getRecentlyViewedFlashcardSets()
                    setRecentlyViewed(recentSets)
                }
            } catch (error) {
                console.error('Error fetching user or recently viewed flashcards:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchRecentlyViewed()
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar />
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            { user ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-3xl mb-4">Welcome, {user.username}!</h1>
                    {recentlyViewed.length > 0 ? (
                        <>
                            <h2 className="text-2xl mb-4">Recently Viewed Flashcard Sets:</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
                                {recentlyViewed.map((set) => (
                                    <SetDisplay key={set._id} flashcardSet={set} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <h2 className="text-2xl mb-4">You have not viewed any flashcard sets recently.</h2>
                    )} 
                </div>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg">Search for flashcards or login to see yours.</p>
                </div>
            )}
        </div>
    )
}