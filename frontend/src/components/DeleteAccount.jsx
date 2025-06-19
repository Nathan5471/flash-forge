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
            <h1 className="text-3xl mb-4 text-center">Delete Account</h1>
            <p className="text-red-500 mb-4 text-center">This action can not be undone, are you sure you would like to delete your account?</p>
            <p className="text-red-500 mb-4 text-center">{error}</p>
            <div className="flex flex-row w-full">
                <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 py-2 px-6 rounded-lg text-white mr-2 w-[calc(50%)]">Delete</button>
                <button onClick={handleCancel} className="bg-gray-500 hover:bg-gray-600 py-2 px-6 rounded-lg text-white w-[calc(50%)]">Cancel</button>
            </div>
        </div>
    )
}
