import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { checkIfLearnSessionExists, generateLearnSession, submitAnswer, deleteLearnSession } from '../utils/LearnAPIHandler';
import { checkIfOfflineLearnSessionExists, generateOfflineLearnSession, checkAnswer, deleteOfflineLearnSession } from '../utils/OfflineLearnManager';
import { getRandomFlashcards } from '../utils/FlashcardAPIHandler';
import { getRandomOfflineFlashcards } from '../utils/DownloadManager';
import Navbar from '../components/Navbar';
import StartLearn from '../components/StartLearn';
import TrueFalse from '../components/learnComponents/TrueFalse';
import MultipleChoice from '../components/learnComponents/MultipleChoice';
import Written from '../components/learnComponents/Written';

export default function Learn({ isOffline = false }) {
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
            let session;
            if (isOffline) {
                session = await generateOfflineLearnSession(id);
            } else {
                session = await generateLearnSession(id);
            }
            if (session.questions.length === 0) {
                if (isOffline) {
                    await deleteOfflineLearnSession(id);
                } else {
                    await deleteLearnSession(id);
                }
                setId(null);
                return;
            }
            setQuestions(session.questions);
        } catch (error) {
            console.error('Error generating learn session:', error);
        } finally {
            setLoading(false);
        }
    }, [isOffline]);
    

    useEffect(() => { 
        const initializeLearnSession = async () => {
            try {
                if (!id && !isPopupOpen) {
                    let exists;
                    if (isOffline) {
                        exists = await checkIfOfflineLearnSessionExists(flashcardSetId);
                    } else {
                        exists = await checkIfLearnSessionExists(flashcardSetId);
                    }
                    if (!exists.learnSessionId) {
                        setIsPopupOpen(true);
                        openOverlay(<StartLearn flashcardSetId={flashcardSetId} onStart={handleGetQuestions} setId={setId} isOffline={isOffline} />);
                    } else {
                        setId(exists.learnSessionId);
                        handleGetQuestions(exists.learnSessionId);
                    }
                }
            } catch (error) {
                console.error('Error checking learn session:', error);
            }
        }
        initializeLearnSession();
    }, [flashcardSetId, handleGetQuestions, openOverlay, id, isPopupOpen, isOffline]);

    useEffect(() => {
        if (questions.length === 0) return;
        const fetchOtherAnswer = async (amount) => {
            try {
                let flashcards;
                if (isOffline) {
                    flashcards = await getRandomOfflineFlashcards(flashcardSetId, amount, questions[currentQuestionIndex].flashcard._id);
                } else {
                    flashcards = await getRandomFlashcards(flashcardSetId, amount, questions[currentQuestionIndex].flashcard._id);
                }
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
    }, [flashcardSetId, questions, currentQuestionIndex, isOffline]);

    const handleAnswerChange = (answer) => {
        setCurrentAnswer(answer);
    }

    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        try {
            const question = questions[currentQuestionIndex];
            let response;
            if (isOffline) {
                response = await checkAnswer(id, question.order, currentAnswer);
            } else {
                response = await submitAnswer(id, question.order, currentAnswer);
            }
            if (!response.isCorrect) {
                setIsWrong(true);
                setCorrectAnswer(response.correctAnswer);
                return;
            }
            handleNextQuestion();
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
            if (isOffline) {
                await deleteOfflineLearnSession(id);
            } else {
                await deleteLearnSession(id);
            }
            setQuestions([]);
            setCurrentQuestionIndex(0);
            setCurrentAnswer('');
            setLoading(true);
            setId(null);
            setIsPopupOpen(true);
            openOverlay(<StartLearn flashcardSetId={flashcardSetId} onStart={handleGetQuestions} setId={setId} isOffline={isOffline} />);
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
            let nextSession;
            if (isOffline) {
                nextSession = await generateOfflineLearnSession(id);
            } else {
                nextSession = await generateLearnSession(id);
            }
            setQuestions(nextSession.questions);
            setLoading(false);
        } catch (error) {
            console.error('Error generating next session:', error);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        )
    }

    if (finished) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar isOffline={isOffline} />
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
                                onClick={() => window.location.href = `${isOffline ? '/downloads' : ''}/set/${flashcardSetId}`}
                            >Return to set</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
            <Navbar isOffline={isOffline} />
            <div className="flex flex-col items-center justify-center h-full w-screen">
                <form className="flex flex-col items-center justify-center bg-gray-700 rounded-lg p-4 w-1/3" onSubmit={handleAnswerSubmit}>
                    {questions[currentQuestionIndex].questionType === 'trueFalse' && (
                        <TrueFalse
                            flashcard={questions[currentQuestionIndex].flashcard}
                            otherAnswer={otherAnswers}
                            onAnswerSelected={handleAnswerChange}
                        />
                    )}
                    {questions[currentQuestionIndex].questionType === 'multipleChoice' && (
                        <MultipleChoice
                            flashcard={questions[currentQuestionIndex].flashcard}
                            otherAnswers={otherAnswers}
                            onAnswerSelected={handleAnswerChange}
                        />
                    )}
                    {questions[currentQuestionIndex].questionType === 'written' && (
                        <Written
                            flashcard={questions[currentQuestionIndex].flashcard}
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
                                className="bg-blue-500 hover:bg-blue-600 rounded-lg py-2 w-1/2 mr-2"
                                onClick={handleNextQuestion}
                            >Next</button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 rounded-lg py-2 w-1/2 mr-2"
                            >Submit</button>
                        )}
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 rounded-lg py-2 w-1/2 ml-2"
                            onClick={handleReset}
                        >Reset</button>
                    </div>
                </form>
            </div>
        </div>
    )
}