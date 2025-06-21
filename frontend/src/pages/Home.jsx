import React, { useEffect, useState } from 'react'
import { getUser } from '../utils/AuthAPIHandler'
import { getRecentlyViewedFlashcardSets, getUserFlashcardSets, getRecentlyCreatedFlashcardSets } from '../utils/FlashcardAPIHandler'
import sortSets from '../utils/SortSets'
import Navbar from '../components/Navbar'
import SetDisplay from '../components/SetDisplay'

export default function Home() {
    const [user, setUser] = useState(null)
    const [recentlyViewed, setRecentlyViewed] = useState([])
    const [userSets, setUserSets] = useState([])
    const [recentlyCreated, setRecentlyCreated] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            try {
                const recentlyCreatedSets = await getRecentlyCreatedFlashcardSets()
                setRecentlyCreated(recentlyCreatedSets)
                const userData = await getUser()
                setUser(userData.user)
                if (userData) {
                    const recentSets = await getRecentlyViewedFlashcardSets()
                    recentSets.reverse()
                    setRecentlyViewed(recentSets)
                    const userSets = await getUserFlashcardSets(userData.user._id)
                    const sortedUserSets = sortSets(userSets, 'date', false) // Sort by date, descending
                    if (sortedUserSets.length > 10) {
                        setUserSets(sortedUserSets.slice(0, 10)) // Limit to 10 sets
                    } else {
                        setUserSets(sortedUserSets)
                    }
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
        <div className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
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
                    {userSets.length > 0 ? (
                        <>
                            <h2 className="text-2xl mb-4">Your Flashcard Sets:</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
                                {userSets.map((set) => (
                                    <SetDisplay key={set._id} flashcardSet={set} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <h2 className="text-2xl mb-4">You have no flashcard sets yet. Create one!</h2>
                    )}
                    {recentlyCreated.length > 0 ? (
                        <>
                            <h2 className="text-2xl mb-4">Recently Created Flashcard Sets:</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
                                {recentlyCreated.map((set) => (
                                    <SetDisplay key={set._id} flashcardSet={set} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <h2 className="text-2xl mb-4">No recently created flashcard sets found.</h2>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-full">
                    {recentlyCreated.length > 0 ? (
                        <>
                            <h2 className="text-2xl mb-4">Recently Created Flashcard Sets:</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
                                {recentlyCreated.map((set) => (
                                    <SetDisplay key={set._id} flashcardSet={set} />
                                ))}
                            </div>
                        </>
                     ) : (
                        <h2 className="text-2xl mb-4">No recently created flashcard sets found.</h2>
                    )}
                </div>
            )}
        </div>
    )
}