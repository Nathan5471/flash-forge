import React, { useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';
import { joinClass } from '../utils/ClassAPIHandler';

export default function JoinClass() {
    const { closeOverlay } = useOverlayContext();
    const [joinCode, setJoinCode] = useState('');
    const [error, setError] = useState('');

    const handleJoinClass = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await joinClass(joinCode);
            if (response.classId) {
                closeOverlay();
                window.location.href= `/classes/${response.classId}`;
            }
        } catch (error) {
            console.error('Error joining class:', error);
            setError(error.message || 'Failed to join class. Please try again.');
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl text-primary-a0 font-bold mb-4 text-center">Join Class</h1>
            <form onSubmit={handleJoinClass} className="flex flex-col w-80">
                <p className="text-xl text-left mb-2">Join Code</p>
                <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="Enter Class Join Code"
                    className="mb-4 p-2 bg-surface-a2 rounded w-full"
                    required
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="flex flex-row w-full">
                    <button type="submit" className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg mr-2 w-1/2">Join</button>
                    <button type="button" onClick={handleCancel} className="bg-tonal-a1 hover:bg-tonal-a2 p-2 rounded-lg w-1/2">Cancel</button>
                </div>
            </form>
        </div>
    )
}