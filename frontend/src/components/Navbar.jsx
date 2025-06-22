import React, { useEffect, useState } from 'react';
import { getUser } from '../utils/AuthAPIHandler';
import { Link, useNavigate } from 'react-router-dom';
import { GoSearch } from "react-icons/go";
import { FaPlus } from "react-icons/fa";

export default function Navbar() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
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
        fetchUser();
    }, []);

    return (
        <div className="flex flex-row h-[calc(10%)] w-full bg-gray-700 items-center justify-between p-2">
            <Link to="/" className="text-white text-3xl hover:text-gray-300 font-bold">Flash Forge</Link>
            <div className="flex flex-row gap-2 w-[calc(40%)]">
                <input type="text" placeholder="Search flashcards..." className="p-2 rounded-lg bg-gray-600 text-white w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') handleSearch(e)}}/>
                <button className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-lg" onClick={handleSearch}><GoSearch /></button>
            </div>
            { loading ? (
                <Link to="/downloads" className="text-white bg-gray-600 rounded-lg py-1 px-2 hover:bg-gray-500 text-2xl">Downloads</Link>
            ) : (
                <div className="flex flex-row gap-4">
                    {user ? (
                        <div className="flex flex-row gap-2">
                            <Link to="/create" className="text-white bg-gray-600 rounded-full p-2 hover:bg-gray-500 text-2xl"><FaPlus /></Link>
                            <Link to="/downloads" className="text-white bg-gray-600 rounded-lg py-1 px-2 hover:bg-gray-500 text-2xl">Downloads</Link>
                            <Link to={`/user/${user._id}`} className="text-white bg-gray-600 rounded-lg py-1 px-2 hover:bg-gray-500 text-2xl">My Sets</Link>
                            <Link to="/settings" className="text-white bg-gray-600 rounded-lg py-1 px-2 hover:bg-gray-500 text-2xl">Settings</Link>
                        </div>
                    ) : (
                        <div className="flex flex-row gap-2">
                            <Link to="/login" className="text-white bg-gray-600 rounded-lg py-1 px-2 hover:bg-gray-500 text-2xl">Login</Link>
                            <Link to="/register" className="text-white bg-gray-600 rounded-lg py-1 px-2 hover:bg-gray-500 text-2xl">Register</Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}