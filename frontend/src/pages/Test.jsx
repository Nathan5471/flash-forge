import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getFlashcardSet } from '../utils/FlashcardAPIHandler';
import Navbar from '../components/Navbar';
import StartTest from '../components/StartTest';

export default function Test() {
    const { id } = useParams();
    const { openOverlay } = useOverlayContext();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [questionTypes, setQuestionTypes] = useState(['multipleChoice']);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [readyForTest, setReadyForTest] = useState(false);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                const flashcardData = await getFlashcardSet(id);
                setFlashcardSet(flashcardData);
            } catch (error) {
                console.error('Error fetching flashcard set:', error);
                setFlashcardSet(null);
            } finally {
                setLoading(false);
            }
        }
        fetchFlashcardSet();
    }, [id]);

    useEffect(() => {
        if (flashcardSet && loading === false && !isPopupOpen) {
            const handleAddTestInfo = (amount, types) => {
                setQuestionCount(amount);
                setQuestionTypes(types);
                setReadyForTest(true);
            }
            setIsPopupOpen(true);
            openOverlay(
                <StartTest
                    flashcardSetData={flashcardSet}
                    onStartTest={handleAddTestInfo}
                />
            );
        }
    }, [flashcardSet, loading, openOverlay, isPopupOpen]);

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex items-center justify-center h-full">
                <p className="text-lg">Loading...</p>
            </div>
        </div>
    )
}