import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClass } from '../utils/ClassAPIHandler';
import Navbar from '../components/Navbar';

export default function CreateClass() {
    const navigate= useNavigate();
    const [className, setClassName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');

    const handleCreateClass = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await createClass(className, joinCode);
            navigate(`/classes/${response.class._id}`);
        } catch (error) {
            console.error('Error creating class:', error);
            setError(error.message || 'Failed to create class');
        }
    }

    return (
        <div className="flex flex-col min-h-screen bg-tonal-a0 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center">
                <h1 className="primary-a0 text-4xl font-bold text-center mt-6">Create Class</h1>
                <form className="flex flex-col w-96 bg-surface-a1 rounded-lg p-6 mt-4" onSubmit={handleCreateClass}>
                    <label className="text-lg mb-2">CLass Name</label>
                    <input
                        type="text"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        className="p-2 mb-4 rounded-lg bg-surface-a2"
                    />
                    <label className="text-lg mb-2">Join Code</label>
                    <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value)}
                        className="p-2 mb-4 rounded-lg bg-surface-a2"
                    />
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <button
                        type="submit"
                        className="bg-primary-a0 hover:bg-primary-a1 p-2 w-full rounded-lg"
                    >Create Class</button>
                </form>
            </div>
        </div>
    )
}