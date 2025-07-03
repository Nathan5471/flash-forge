import React, { useEffect, useState } from 'react';
import { getClass, leaveClass } from '../utils/ClassAPIHandler';
import { useOverlayContext } from '../contexts/OverlayContext';

export default function LeaveClass({ classId }) {
    const { closeOverlay } = useOverlayContext();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const classData = await getClass(classId);
                setClassData(classData.class);
            } catch (error) {
                console.error('Error fetching class data:', error);
                setError('Failed to load class data');
            } finally {
                setLoading(false);
            }
        }
        fetchClassData();
    }, [classId]);

    const handleLeaveClass = async (e) => {
        e.preventDefault();
        try {
            await leaveClass(classId);
            closeOverlay();
        } catch (error) {
            console.error('Error leaving class:', error);
            setError(error.message || 'Failed to leave class');
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    if (loading) {
        return (
            <div className="flex flex-col w-80">
                <p className="text-2xl">Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-80">
            <h1 className="text-2xl font-bold mb-4">Leave Class</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-red-500 mb-4">Are you sure you want to leave the class <span className="font-bold">{classData.className}</span>?</p>
            <div className="flex flex-row justify-between">
                <button
                    className="bg-red-500 hover:bg-red-600 p-2 rounded-lg mr-2 w-1/2"
                    onClick={handleLeaveClass}
                >Leave Class</button>
                <button
                    className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-1/2"
                    onClick={handleCancel}
                >Cancel</button>
            </div>
        </div>
    )
}