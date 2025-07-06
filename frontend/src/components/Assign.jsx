import React, { useEffect, useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getUserClassesWhereTeacher, checkIsAssigned, assignFlashcardSet, unassignFlashcardSet } from '../utils/ClassAPIHandler';

export default function Assign({ flashcardSetId }) {
    const { closeOverlay } = useOverlayContext();
    const [classes, setClasses] = useState([]);
    const [assignedClasses, setAssignedClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const classesData = await getUserClassesWhereTeacher();
                setClasses(classesData.classes);
                for (const classData of classesData.classes) {
                    const isAssigned = await checkIsAssigned(classData._id, flashcardSetId);
                    if (isAssigned.isAssigned) {
                        setAssignedClasses(prev => [...prev, classData._id]);
                    }
                }
            } catch (error) {
                setError(error.message || 'Failed to fetch classes');
            } finally {
                setLoading(false);
            }
        }
        fetchClasses();
    }, [flashcardSetId]);

    const handleAssign = async (e, classId) => {
        e.preventDefault();
        try {
            await assignFlashcardSet(classId, flashcardSetId);
            setAssignedClasses(prev => [...prev, classId]);
        } catch (error) {
            console.error('Error assigning flashcard set:', error);
        }
    }

    const handleUnassign = async (e, classId) => {
        e.preventDefault();
        try {
            await unassignFlashcardSet(classId, flashcardSetId);
            setAssignedClasses(prev => prev.filter(id => id !== classId));
        } catch (error) {
            console.error('Error unassigning flashcard set:', error);
        }
    }

    const handleClose = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    if (loading) {
        return (
            <div className="flex flex-col w-80">
                <p className="text-center">Loading...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col w-80">
                <p className="text-center text-red-500">{error}</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-80">
            <h2 className="text-lg font-semibold mb-4">Assign Flashcard Set</h2>
            {classes.map((classData) => (
                <div key={classData._id} className="flex flex-row justify-between mb-2 p-2 bg-surface-a2 rounded-lg">
                    <h3 className="text-lg">{classData.className}</h3>
                    {assignedClasses.includes(classData._id) ? (
                        <button
                            className="bg-red-500 hover:bg-red-600 p-2 rounded-lg"
                            onClick={(e) => handleUnassign(e, classData._id)}
                        >Unassign</button>
                    ) : (
                        <button
                            className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg"
                            onClick={(e) => handleAssign(e, classData._id)}
                        >Assign</button>
                    )}
                </div>
            ))}
                <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg mt-4"
                    onClick={handleClose}
                >Close</button>
        </div>
    )
}