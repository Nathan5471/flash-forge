import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { checkIfLearnSessionExists, generateLearnSession, submitAnswer, deleteLearnSession } from '../utils/LearnAPIHandler';
import { getRandomFlashcards } from '../utils/FlashcardAPIHandler';
import Navbar from '../components/Navbar';
import StartLearn from '../components/StartLearn';
import TrueFalse from '../components/learnComponents/TrueFalse';

export default function Learn() {
    const { openOverlay } = useOverlayContext();
    const { flashcardSetId } = useParams();
    const [id, setId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [otherAnswers, setOtherAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [currentQuestionOrder, setCurrentQuestionOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleGetQuestions = useCallback(async (id) => {
        try {
            const session = await generateLearnSession(id);
            setQuestions(session.questions);
            console.log('Learn session generated:', session);
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

    useEffect(() => {
        if (questions.length === 0) return;
        const fetchOtherAnswer = async (amount) => {
            try {
                const flashcards = await getRandomFlashcards(flashcardSetId, amount, questions[currentQuestionIndex].flashcard._id);
                setOtherAnswers(flashcards.map(flashcard => flashcard.answer));
            } catch (error) {
                console.error('Error fetching other answers:', error);
            }
        }
        if (questions[currentQuestionIndex].questionType === 'trueFalse') {
            fetchOtherAnswer(1);
        } else if (questions[currentQuestionIndex].questionType === 'multipleChoice') {
            fetchOtherAnswer(3);
        }
    }, [flashcardSetId, questions, currentQuestionIndex]);

    const handleAnswerChange = (order, answer) => {
        setCurrentAnswer(answer);
        setCurrentQuestionOrder(order);
    }

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        if (!currentAnswer.trim()) {
            return;
        }
        try {
            const question = questions[currentQuestionIndex];
            const response = await submitAnswer(id, question.order, currentAnswer);
            if (response.correct) {
                console.log('Correct answer!');
            } else {
                console.log('Incorrect answer. Correct answer was:', question.flashcard.answer);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    }

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

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-full p-4">
                {questions[currentQuestionIndex].questionType === 'trueFalse' && (
                    <TrueFalse
                        flashcard={questions[currentQuestionIndex].flashcard}
                        questionOrder={questions[currentQuestionIndex].order}
                        otherAnswer={otherAnswers}
                        onAnswerSelected={handleAnswerChange}
                    />
                )}
            </div>
        </div>
    )
}