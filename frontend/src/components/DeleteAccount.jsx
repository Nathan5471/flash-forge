import React, { useState } from 'react';
import { useOverlayContext } from "../contexts/OverlayContext";
import { deleteUser } from "../utils/AuthAPIHandler";

export default function DeleteAccount() {
    const { closeOverlay } = useOverlayContext();
    const [error, setError] = useState('');

    const handleDelete = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await deleteUser();
            closeOverlay();
            window.location.href = '/login';
        } catch (error) {
            setError(error.message || 'Failed to delete account');
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col w-80">
            <h1 className="text-3xl text-[#f081e7] font-bold mb-4 text-center">Delete Account</h1>
            <p className="text-red-500 mb-4 text-center">This action can not be undone, are you sure you would like to delete your account?</p>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <div className="flex flex-row w-full">
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 p-2 rounded-lg mr-2 w-1/2">Delete</button>
                <button onClick={handleCancel} className="bg-[#3a3238] hover:bg-[#4f484e] p-2 rounded-lg w-1/2">Cancel</button>
            </div>
        </div>
    )
}
