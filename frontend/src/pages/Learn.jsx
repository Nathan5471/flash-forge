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
    const [finished, setFinished] = useState(false);

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
        try {
            const question = questions[currentQuestionIndex];
            console.log(id, question.order, currentAnswer);
            const response = await submitAnswer(id, question.order, currentAnswer);
            if (response.isCorrect) {
                console.log('Correct answer!');
            } else {
                console.log('Incorrect answer. Correct answer was:', question.flashcard.answer);
            }
            setCurrentAnswer('');
            if ( currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                setFinished(true);
            }
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    }

    const handleReset = async () => {
        try {
            await deleteLearnSession(id);
            setQuestions([]);
            setCurrentQuestionIndex(0);
            setCurrentAnswer('');
            setCurrentQuestionOrder(null);
            setLoading(true);
            setId(null);
            openOverlay(<StartLearn flashcardSetId={flashcardSetId} onStart={handleGetQuestions} setId={setId} />);
        } catch (error) {
            console.error('Error resetting learn session:', error);
        }
    }

    const handleNextSession = async () => {
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setCurrentAnswer('');
        setCurrentQuestionOrder(null);
        setLoading(true);
        setFinished(false);
        try {
            const nextSession = await generateLearnSession(id);
            setQuestions(nextSession.questions);
            setLoading(false);
        } catch (error) {
            console.error('Error generating next session:', error);
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

    if (finished) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar />
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center justify-center p-4 w-1/3 bg-gray-700 rounded-lg">
                        <h2 className="text-2xl mb-4">Congratulations!</h2>
                        <p className="mb-4">You have completed the learning session.</p>
                        <div className="flex flex-row w-full justify-between">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4 w-1/2 mr-2"
                                onClick={handleNextSession}
                            >Next Session</button>
                            <button
                                className="bg-gray-500 hover:bg-gray-600 rounded-lg py-2 px-4 w-1/2"
                                onClick={() => window.location.href = `/set/${flashcardSetId}`}
                            >Return to set</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center h-full w-screen">
            <div className="flex flex-col items-center justify-center h-full p-4 w-1/3">
                {questions[currentQuestionIndex].questionType === 'trueFalse' && (
                    <TrueFalse
                        flashcard={questions[currentQuestionIndex].flashcard}
                        questionOrder={questions[currentQuestionIndex].order}
                        otherAnswer={otherAnswers}
                        onAnswerSelected={handleAnswerChange}
                    />
                )}
                <div className="flex flex-row justify-between w-full p-2 rounded-lg bg-gray-700">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4 w-1/2 mr-2"
                        onClick={handleAnswerSubmit}
                    >Submit</button>
                    <button
                        className="bg-red-500 hover:bg-red-600 rounded-lg py-2 px-4 w-1/2 ml-2"
                        onClick={handleReset}
                    >Reset</button>
                </div>
            </div>
            </div>
        </div>
    )
}