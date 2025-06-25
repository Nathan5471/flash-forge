import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { checkIfLearnSessionExists, generateLearnSession, submitAnswer, deleteLearnSession } from '../utils/LearnAPIHandler';
import { getRandomFlashcards } from '../utils/FlashcardAPIHandler';
import Navbar from '../components/Navbar';
import StartLearn from '../components/StartLearn';
import TrueFalse from '../components/learnComponents/TrueFalse';
import MultipleChoice from '../components/learnComponents/MultipleChoice';
import Written from '../components/learnComponents/Written';

export default function Learn() {
    const { openOverlay } = useOverlayContext();
    const { flashcardSetId } = useParams();
    const [id, setId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [otherAnswers, setOtherAnswers] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isWrong, setIsWrong] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [finished, setFinished] = useState(false);

    const handleGetQuestions = useCallback(async (id) => {
        try {
            const session = await generateLearnSession(id);
            if (session.questions.length === 0) {
                await deleteLearnSession(id);
                setId(null);
                return;
            }
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
                if (!id && !isPopupOpen) {
                    console.log(id);
                    const exists = await checkIfLearnSessionExists(flashcardSetId);
                    console.log('Learn session exists:', exists);
                    if (!exists.learnSessionId) {
                        setIsPopupOpen(true);
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
    }, [flashcardSetId, handleGetQuestions, openOverlay, id, isPopupOpen]);

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

    const handleAnswerChange = (answer) => {
        setCurrentAnswer(answer);
    }

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            const question = questions[currentQuestionIndex];
            console.log(id, question.order, currentAnswer);
            const response = await submitAnswer(id, question.order, currentAnswer);
            if (!response.isCorrect) {
                setIsWrong(true);
                setCorrectAnswer(response.correctAnswer);
                return;
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

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsWrong(false);
            setCurrentAnswer('');
        } else {
            setFinished(true);
            setIsWrong(false);
            setCurrentAnswer('');
        }
    }

    const handleReset = async () => {
        try {
            await deleteLearnSession(id);
            setQuestions([]);
            setCurrentQuestionIndex(0);
            setCurrentAnswer('');
            setLoading(true);
            setId(null);
            openOverlay(<StartLearn flashcardSetId={flashcardSetId} onStart={handleGetQuestions} setId={setId} />);
        } catch (error) {
            console.error('Error resetting learn session:', error);
        }
    }

    const handleNextSession = async () => {
        setLoading(true);
        setFinished(false);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setCurrentAnswer('');
        try {
            const nextSession = await generateLearnSession(id);
            console.log('Next session generated:', nextSession);
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
            <form className="flex flex-col items-center justify-center bg-gray-700 rounded-lg p-4 w-1/3" onSubmit={handleAnswerSubmit}>
                {questions[currentQuestionIndex].questionType === 'trueFalse' && (
                    <TrueFalse
                        flashcard={questions[currentQuestionIndex].flashcard}
                        questionOrder={questions[currentQuestionIndex].order}
                        otherAnswer={otherAnswers}
                        onAnswerSelected={handleAnswerChange}
                    />
                )}
                {questions[currentQuestionIndex].questionType === 'multipleChoice' && (
                    <MultipleChoice
                        flashcard={questions[currentQuestionIndex].flashcard}
                        questionOrder={questions[currentQuestionIndex].order}
                        otherAnswers={otherAnswers}
                        onAnswerSelected={handleAnswerChange}
                    />
                )}
                {questions[currentQuestionIndex].questionType === 'written' && (
                    <Written
                        flashcard={questions[currentQuestionIndex].flashcard}
                        questionOrder={questions[currentQuestionIndex].order}
                        onAnswerSelected={handleAnswerChange}
                    />
                )}
                {isWrong && (
                    <p className="text-red-500 mb-4">
                        Incorrect! The correct answer was: <strong>{correctAnswer}</strong>
                    </p>
                )}
                <div className="flex flex-row justify-between w-full p-2 rounded-lg">
                    {isWrong ? (
                        <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4 w-1/2 mr-2"
                            onClick={handleNextQuestion}
                        >Next</button>
                    ) : (
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 rounded-lg py-2 px-4 w-1/2 mr-2"
                        >Submit</button>
                    )}
                    <button
                        type="button"
                        className="bg-red-500 hover:bg-red-600 rounded-lg py-2 px-4 w-1/2 ml-2"
                        onClick={handleReset}
                    >Reset</button>
                </div>
            </form>
            </div>
        </div>
    )
}