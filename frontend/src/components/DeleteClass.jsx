import React, { useEffect, useState } from "react";
import { useOverlayContext } from "../contexts/OverlayContext";
import { getClass, deleteClass } from "../utils/ClassAPIHandler";

export default function DeleteClass({ classId }) {
    const { closeOverlay } = useOverlayContext();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const data = await getClass(classId);
                setClassData(data.class);
            } catch (error) {
                console.error("Error fetching class data:", error);
                setError(error.message || "An error occurred while fetching class data.");
            } finally {
                setLoading(false);
            }
        }
        fetchClassData();
    }, [classId]);

    const handleDeleteClass = async (e) => {
        e.preventDefault();
        try {
            await deleteClass(classId);
            closeOverlay();
            window.location.href = "/classes";
        } catch (error) {
            console.error("Error deleting class:", error);
            setError(error.message || "An error occurred while deleting the class.");
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    if (loading) {
        return (
            <div className="flex flex-col w-80">
                <p className="text-lg">Loading...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-80">
            <h1 className="text-2xl font-bold mb-4">Delete Class</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-red-500 mb-4">Are you sure you want to delete the class <span className="font-bold">{classData?.name}</span>? This action is permanent and can not be undone.</p>
            <div className="flex flex-row justify-between">
                <button
                    className="bg-red-500 hover:bg-red-600 p-2 rounded-lg mr-2 w-1/2"
                    onClick={handleDeleteClass}
                >Delete</button>
                <button
                    className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-1/2"
                    onClick={handleCancel}
                >Cancel</button>
            </div>
        </div>
    )
}