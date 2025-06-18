import React, { useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';
import { updatePassword } from '../utils/AuthAPIHandler';

export default function EditPassword() {
    const { closeOverlay } = useOverlayContext();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await updatePassword(password);
            closeOverlay();
        } catch (error) {
            setError(error.message || 'Failed to update password');
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col">
            <h1 className="text-3xl mb-4 text-center">Edit Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="mb-4 p-2 bg-gray-700 rounded w-full"
                    required
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="flex flex-row w-full">
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 py-2 px-6 rounded-lg text-white mr-2 w-[calc(50%)]">Save</button>
                    <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 py-2 px-6 rounded-lg text-white w-[calc(50%)]">Cancel</button>
                </div>
            </form>
        </div>
    )
}