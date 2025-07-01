import React, { useEffect, useState } from 'react';
import { getUserClasses } from '../utils/ClassAPIHandler';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function Classes() {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const classesData = await getUserClasses();
                setClasses(classesData.classes);
            } catch (error) {
                console.error('Error fetching classes:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchClasses();
    }, [])

    const handleLeaveClass = async (e, classId) => {
        e.preventDefault();
        console.log(`Implement leave class for class ID: ${classId}`);
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-tonal-a0 text-white">
                <Navbar />
                <div className="flex items-center justify-center">
                    <p className="text-2xl">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-tonal-a0 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center mt-6">
                { classes.length > 0 ? (
                    classes.map((classData) => (
                        <div className="bg-surface-a2 p-4 rounded-lg w-3/4" key={classData._id}>
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-col items-center">
                                    <h2 className="text-2xl font-bold text-primary-a0">{classData.className}</h2>
                                    <p className="text-lg text-surface-a5">Teacher: {classData.teacher.username}</p>
                                </div>
                                <div className="flex flex-col w-[calc(15%)]">
                                    <Link to={`/classes/${classData._id}`} className="bg-primary-ao hover:bg-primary-a1 text-center p-2 w-full rounded-lg">View</Link>
                                    <button
                                        className="bg-primary-a0 hover:bg-primary-a1 text-center p-2 w-full rounded-lg mt-2"
                                        onClick={(e) => handleLeaveClass(e, classData._id)}
                                    >Leave</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-4xl text-center">No classes found</p>
                )}
            </div>
        </div>
    )
}