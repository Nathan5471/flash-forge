import React, { useEffect, useState } from 'react';
import { getUser } from '../utils/AuthAPIHandler';
import { Link, useNavigate } from 'react-router-dom';
import { GoSearch } from "react-icons/go";
import { FaPlus } from "react-icons/fa";

export default function Navbar({ isOffline = false }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`${isOffline ? '/downloads' : ''}/search/${encodeURIComponent(searchTerm.trim())}`);
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await getUser();
                setUser(userData.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        if (!isOffline) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [isOffline]);

    return (
        <div className="flex flex-row h-[calc(10%)] w-full bg-tonal-a1 items-center justify-between p-2">
            <Link to={`/${isOffline ? 'downloads' : ''}`} className="text-sm sm:text-lg md:text-xl lg:text-3xl text-primary-a0 hover:text-primary-a1 font-bold">Flash Forge</Link>
            <div className="flex flex-row gap-2 w-[calc(35%)] sm:w-[calc(40%)]">
                <input type="text" placeholder="Search flashcards..." className="p-2 rounded-lg bg-surface-a3 text-white w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') handleSearch(e)}}/>
                <button className="bg-surface-a3 hover:bg-gray-500 p-2 rounded-lg" onClick={handleSearch}><GoSearch /></button>
            </div>
            {isOffline ? (
                <div className="flex flex-row gap-2">
                    <Link to="/downloads/create" className="bg-surface-a3 rounded-full hover:bg-surface-a4 text-xs sm:text-sm md:text-lg lg:text-2xl lg:p-2"><FaPlus /></Link>
                    <Link to="/" className="bg-surface-a3 rounded-lg hover:bg-surface-a4 text-xs sm:text-sm md:text-lg lg:text-2xl lg:py-1 lg:px-2">Online</Link>    
                </div>
            ) : (
                loading ? (
                    <Link to="/downloads" className="bg-surface-a3 rounded-lg hover:bg-surface-a4 text-xs sm:text-sm sm:p-1 md:text-lg lg:text-2xl lg:py-1 lg:px-2">Downloads</Link>
                ) : (
                    <div className="flex flex-row gap-4">
                        {user ? (
                            <div className="flex flex-row gap-2">
                                <Link to="/create" className="bg-surface-a3 rounded-full hover:bg-surface-a4 text-xs sm:text-sm sm:p-1 md:text-lg lg:text-2xl lg:p-2"><FaPlus /></Link>
                                <Link to="/downloads" className="bg-surface-a3 rounded-lg hover:bg-surface-a4 text-xs sm:text-sm sm:p-1 md:text-lg lg:text-2xl lg:py-1 lg:px-2">Downloads</Link>
                                <Link to={`/user/${user._id}`} className="bg-surface-a3 rounded-lg hover:bg-surface-a4 text-xs sm:text-sm sm:p-1 md:text-lg lg:text-2xl lg:py-1 lg:px-2">My Sets</Link>
                                <Link to="/settings" className="bg-surface-a3 rounded-lg hover:bg-surface-a4 text-xs sm:text-sm sm:p-1 md:text-lg lg:text-2xl lg:py-1 lg:px-2">Settings</Link>
                            </div>
                        ) : (
                            <div className="flex flex-row gap-2">
                                <Link to="/login" className="bg-surface-a3 rounded-lg hover:bg-surface-a4 text-xs sm:text-sm sm:p-1 md:text-lg lg:text-2xl lg:py-1 lg:px-2">Login</Link>
                                <Link to="/register" className="bg-surface-a3 rounded-lg hover:bg-surface-a4 text-xs sm:text-sm sm:p-1 md:text-lg lg:text-2xl lg:py-1 lg:px-2">Register</Link>
                            </div>
                        )}
                    </div>
                )
            )}
        </div>
    )
}