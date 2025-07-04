import React, {  useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getClass } from '../utils/ClassAPIHandler';
import { getUser } from '../utils/AuthAPIHandler';
import { useOverlayContext } from '../contexts/OverlayContext';
import Navbar from '../components/Navbar';
import LeaveClass from '../components/LeaveClass';
import RemoveStudent from '../components/RemoveStudent';

export default function Class() {
    const navigate = useNavigate();
    const { classId } = useParams();
    const { openOverlay } = useOverlayContext();
    const [classData, setClassData] = useState(null);
    const [isTeacher, setIsTeacher] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchClassData = async () => {
            try {
                const classData = await getClass(classId);
                setClassData(classData.class);
                const userData = await getUser();
                if (userData.user._id === classData.class.teacher._id) {
                    setIsTeacher(true);
                }
            } catch (error) {
                console.error('Error fetching class data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchClassData();
    }, [classId]);

    const handleLeaveClass = (e) => {
        e.preventDefault();
        openOverlay(
            <LeaveClass classId={classId} />
        );
    }

    const handleRemoveStudent = (e, student) => {
        const removeStudent = () => {
            classData.students = classData.students.filter(s => s._id !== student._id);
            setClassData({ ...classData });
        }
        e.preventDefault();
        if (!isTeacher) {
            return;
        }
        openOverlay(
            <RemoveStudent classId={classId} student={student} onRemove={removeStudent} />
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-tonal-a0 text-white">
                <Navbar />
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-tonal-a0 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-[calc(100%)] p-4">
                <h1 className="text-4xl text-primary-a0 font-bold mb-2">{classData.className}</h1>
                <p className="text-lg mb-2 text-surface-a4">Join Code: {classData.joinCode}</p>
                <div className="flex flex-row justify-between w-full">
                    <div className="flex flex-col bg-surface-a2 p-4 rounded-lg w-1/2 h-full overflow-y-auto">
                        <h2 className="text-2xl text-primary-a0 font-semibold text-center mb-2">Members</h2>
                        <div className="flex flex-row bg-surface-a3 rounded-lg p-2">
                            <div className="flex flex-col">
                                <h3 className="text-lg font-semibold mb-2">{classData.teacher.username}</h3>
                                <p className="text-sm text-surface-a5">Teacher</p>
                            </div>
                            <button
                                className="ml-auto bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg"
                                onClick={() => navigate(`/user/${classData.teacher._id}`)}
                            >View</button>
                        </div>
                        {classData.students.length > 0 && (
                            classData.students.map(student => (
                                <div key={student._id} className="flex flex-row bg-surface-a3 rounded-lg p-2 mt-2">
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-semibold mb-2">{student.username}</h2>
                                        <p className="text-sm text-surface-a5">Student</p>
                                    </div>
                                    <button
                                        className="ml-auto bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg"
                                        onClick={() => navigate(`/user/${student._id}`)}
                                    >View</button>
                                    {isTeacher && (
                                        <button
                                            className="ml-2 bg-red-500 hover:bg-red-600 p-2 rounded-lg"
                                            onClick={(e) => handleRemoveStudent(e, student)}
                                        >Kick</button>
                                    )}
                                </div>
                            ))    
                        )}
                    </div>
                    <div className="flex flex-col bg-surface-a2 p-4 rounded-lg w-1/2 h-full ml-4">
                        <h2 className="text-2xl text-primary-a0 font-semibold text-center mb-2">Assigned Flashcards</h2>
                        { classData.assignedFlashcards.length > 0 ? (
                            classData.assignedFlashcards.map(flashcard => (
                                <div key={flashcard._id} className="flex flex-row bg-surface-a3 rounded-lg p-2 mt-2">
                                    <div className="flex flex-col">
                                        <h3 className="text-lg font-semibold mb-2">{flashcard.title}</h3>
                                        <p className="text-sm text-surface-a5">{flashcard.description}</p>
                                    </div>
                                    <button
                                        className="ml-auto bg-primary-a0 hover:bg-primary-a1 p-2 roundd-lg"
                                        onClick={() => navigate(`/flashcard/${flashcard._id}`)}
                                    >View</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-lg text-center">No flashcards assigned yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}