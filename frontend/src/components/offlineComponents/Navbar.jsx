import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoSearch } from "react-icons/go";
import { FaPlus } from "react-icons/fa";

export default function Navbar() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/downloads/search/${encodeURIComponent(searchTerm.trim())}`);
        }
    }

    return (
        <div className="flex flex-row h-[calc(10%)] w-full bg-gray-700 items-center justify-between p-2">
            <Link to="/downloads" className="text-white text-3xl hover:text-gray-300 font-bold">Flash Forge</Link>
            <div className="flex flex-row gap-2 w-[calc(40%)]">
                <input type="text" placeholder="Search flashcards..." className="p-2 rounded-lg bg-gray-600 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter') handleSearch(e)}} />
                <button className="bg-gray-600 hover:bg-gray-500 p-2 rounded-lg" onClick={handleSearch}><GoSearch /></button>
            </div>
            <div className="flex flex-row gap-2">
                <Link to="/downloads/create" className="text-white bg-gray-600 rounded-full p-2 hover:bg-gray-500 text-2xl"><FaPlus /></Link>
                <Link to="/" className="text-white bg-gray-600 rounded-lg py-1 px-2 hover:bg-gray-500 text-2xl">Online</Link>    
            </div>     
        </div>
    )
}