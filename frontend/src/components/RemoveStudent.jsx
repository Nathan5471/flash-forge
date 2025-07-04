import React, { useState } from "react";
import { useOverlayContext } from "../contexts/OverlayContext";
import { teacherRemoveStudent } from "../utils/ClassAPIHandler";

export default function RemoveStudent({ classId, student, onRemove }) {
    const { closeOverlay } = useOverlayContext();
    const [error, setError] = useState(null);

    const handleRemoveStudent = async (e) => {
        e.preventDefault();
        try {
            await teacherRemoveStudent(classId, student._id);
            closeOverlay();
            onRemove();
        } catch (error) {
            console.error("Error removing student:", error);
            setError(error.message || "An error occurred while removing the student.");
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col w-80">
            <h1 className="text-2xl font-bold mb-4">Remove Student</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <p className="text-red-500 mb-4">Are you sure you want to remove <span className="font-bold">{student.username}</span> from your class?</p>
            <div className="flex flex-row justify-between">
                <button
                    className="bg-red-500 hover:bg-redy-600 p-2 rounded-lg mr-2 w-1/2"
                    onClick={handleRemoveStudent}
                >Remove</button>
                <button
                    className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-1/2"
                    onClick={handleCancel}
                >Cancel</button>
            </div>
        </div>
    )
}