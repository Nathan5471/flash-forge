import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { checkIfLearnSessionExists, generateLearnSession, submitAnswer, deleteLearnSession } from '../utils/LearnAPIHandle';
import Navbar from '../components/Navbar';
import StartLearn from '../components/StartLearn';

export default function Learn() {
    const { openOverlay } = useOverlayContext();
    const { flashcardSetId } = useParams();
    const [id, setId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [loading, setLoading] = useState(true);

    const handleGetQuestions = useCallback(async (id) => {
        try {
            console.log(id);
            const session = await generateLearnSession(id);
            setQuestions(session.questions);
        } catch (error) {
            console.error('Error generating learn session:', error);
        } finally {
            setLoading(false);
        }
    }, []);
    

    useEffect(() => { 
        const initializeLearnSession = async () => {
            try {
                if (!id) {
                    console.log(id);
                    const exists = await checkIfLearnSessionExists(flashcardSetId);
                    console.log('Learn session exists:', exists);
                    if (!exists.learnSessionId) {
                        openOverlay(<StartLearn flashcardSetId={flashcardSetId} onStart={handleGetQuestions} setId={setId} />);
                    } else {
                        console.log('Learn session ID found:', exists.learnSessionId);
                        setId(exists.learnSessionId);
                        handleGetQuestions(exists.learnSessionId);
                    }
                }
            } catch (error) {
                console.error('Error checking learn session:', error);
            }
        }
        initializeLearnSession();
    }, [flashcardSetId, handleGetQuestions, openOverlay, id]);

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar />
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        )
    }
}