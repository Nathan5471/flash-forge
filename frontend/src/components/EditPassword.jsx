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
            <h1 className="text-3xl text-primary-a0 font-bold mb-4 text-center">Edit Password</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="mb-4 p-2 bg-surface-a2 rounded w-full"
                    required
                />
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="flex flex-row w-full">
                    <button type="submit" className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg mr-2 w-1/2">Save</button>
                    <button onClick={handleCancel} className="bg-tonal-a1 hover:bg-tonal-a2 p-2 rounded-lg w-1/2">Cancel</button>
                </div>
            </form>
        </div>
    )
}