import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getFlashcardSet } from '../utils/FlashcardAPIHandler';
import { getDownloadedFlashcardSet } from '../utils/DownloadManager';
import CalcAmountPerType from '../utils/CalcAmountPerType';
import Navbar from '../components/Navbar';
import StartTest from '../components/StartTest';
import MultipleChoice from '../components/testComponents/MultipleChoice';
import Written from '../components/testComponents/Written';
import TrueFalse from '../components/testComponents/TrueFalse';
import Matching from '../components/testComponents/Matching';
import UnansweredQuestionsPopup from '../components/testComponents/UnansweredQuestionsPopup';
import GradeChart from '../components/testComponents/GradeChart';
import GradedMultipleChoice from '../components/testComponents/gradedComponents/GradedMultipleChoice';
import GradedWritten from '../components/testComponents/gradedComponents/GradedWritten'
import GradedTrueFalse from '../components/testComponents/gradedComponents/GradedTrueFalse';
import GradedMatching from '../components/testComponents/gradedComponents/GradedMatching';

export default function Test({ isOffline = false }) {
    const { id } = useParams();
    const { openOverlay } = useOverlayContext();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [questionTypes, setQuestionTypes] = useState(['multipleChoice']);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [readyForTest, setReadyForTest] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [grade, setGrade] = useState(0);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                let flashcardData;
                if (isOffline) {
                    flashcardData = await getDownloadedFlashcardSet(id);
                } else {
                    flashcardData = await getFlashcardSet(id);
                }
                setFlashcardSet(flashcardData);
            } catch (error) {
                console.error('Error fetching flashcard set:', error);
                setFlashcardSet(null);
            } finally {
                setLoading(false);
            }
        }
        fetchFlashcardSet();
    }, [id, isOffline]);

    useEffect(() => {
        if (flashcardSet && loading === false && readyForTest === false && !isPopupOpen) {
            const handleAddTestInfo = (amount, types) => {
                setQuestionTypes(types);
                const amountPerType = CalcAmountPerType(types, amount);
                const shuffledQuestions = [...flashcardSet.flashCards].sort(() => Math.random() - 0.5);
                const selectedQuestions = shuffledQuestions.slice(0, amount);
                const questions = selectedQuestions.map((question, index) => {
                    const questionType = amountPerType[index];
                    if (questionType === 'multipleChoice') {
                        const answerChoices = flashcardSet.flashCards.map(flashcard => flashcard.answer)
                        .filter(answer => answer !== question.answer)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 3)
                        .concat(question.answer);
                        return {
                            question: question.question,
                            answer: question.answer,
                            type: questionType,
                            answerChoices: answerChoices.sort(() => Math.random() - 0.5),
                            questionNumber: index + 1
                        };
                    } else if (questionType === 'written') {
                        return {
                            question: question.question,
                            answer: question.answer,
                            type: questionType,
                            questionNumber: index + 1
                        };
                    } else if (questionType === 'trueFalse') {
                        const answerChoices = flashcardSet.flashCards.map(flashcard => flashcard.answer)
                        .filter(answer => answer !== question.answer)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 1)
                        .concat(question.answer);
                        return {
                            question: question.question,
                            answer: question.answer,
                            type: questionType,
                            answerChoice: [...answerChoices].sort(() => Math.random() - 0.5)[0],
                            questionNumber: index + 1
                        };
                    } else if (questionType === 'matching') {
                        return {
                            question: question.question,
                            answer: question.answer,
                            type: questionType,
                            questionNumber: index + 1
                        };
                    }
                })
                setQuestions(questions);
                setIsPopupOpen(false);
                setReadyForTest(true);
            }
            setIsPopupOpen(true);
            openOverlay(
                <StartTest
                    flashcardSetData={flashcardSet}
                    onStartTest={handleAddTestInfo}
                    isOffline={isOffline}
                />
            );
        }
    }, [flashcardSet, loading, openOverlay, isPopupOpen, readyForTest, isOffline]);

    const handleAnswerChange = (answerData) => {
        const newSelectedAnswers = { ...selectedAnswers };
        newSelectedAnswers[answerData.questionNumber] = answerData;
        setSelectedAnswers(newSelectedAnswers);
    }

    const gradeTest = () => {
        const correctAnswers = Object.values(selectedAnswers).filter(answer => answer.isCorrect).length;
        const totalQuestions = questions.length;
        const score = (correctAnswers / totalQuestions) * 100;
        setGrade(score);
        setIsFinished(true);
    }

    const handleSubmitTest = () => {
        const answerCount = Object.keys(selectedAnswers).length;
        if (answerCount < questions.length) {
            openOverlay(
                <UnansweredQuestionsPopup
                    amount={questions.length - answerCount}
                    onClose={gradeTest}
                />
            )
        } else {
            gradeTest();
        }
    }

    const handleRetakeTest = (e) => {
        e.preventDefault();
        setSelectedAnswers({});
        setIsFinished(false);
        setReadyForTest(false);
        setGrade(0);
        setQuestions([]);
        setIsPopupOpen(false);
    }

    if (loading || !readyForTest) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        )
    }

    if (isFinished) {
        return (
            <div className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex flex-col items-center justify-center p-4">
                    <h1 className="text-3xl mb-4 text-center">Test: {flashcardSet.title}</h1>
                    <div className="bg-gray-700 p-6 rounded-lg w-[calc(50%)] text-center mb-4">
                        <h2 className="text-2xl mb-4">Test Completed!</h2>
                        <p className="text-lg mb-4">You answered {Object.values(selectedAnswers).filter(answer => answer.isCorrect).length} out of {questions.length} questions correctly!</p>
                        <div className="flex flex-col items-center">
                            <GradeChart grade={grade} />
                        </div>
                    </div>
                    <div className="w-[calc(50%)]">
                        {questionTypes.includes('multipleChoice') && (
                            questions.filter(question => question.type === 'multipleChoice').map((question, index) => (
                                <GradedMultipleChoice
                                    key={index}
                                    question={question}
                                    selectedAnswer={selectedAnswers[question.questionNumber] || {questionNumber: question.questionNumber, selectedAnswer: null, isCorrect: false}}
                                />
                            ))
                        )}
                        {questionTypes.includes('written') && (
                            questions.filter(question => question.type === 'written').map((question, index) => (
                                <GradedWritten
                                    key={index}
                                    question={question}
                                    selectedAnswer={selectedAnswers[question.questionNumber] || {questionNumber: question.questionNumber, selectedAnswer: '', isCorrect: false}}
                                />
                            ))
                        )}
                        {questionTypes.includes('trueFalse') && (
                            questions.filter(question => question.type === 'trueFalse').map((question, index) => (
                                <GradedTrueFalse
                                    key={index}
                                    question={question}
                                    selectedAnswer={selectedAnswers[question.questionNumber] || {questionNumber: question.questionNumber, selectedAnswer: null, isCorrect: false}}
                                />
                            ))
                        )}
                        {questionTypes.includes('matching') && (
                            <GradedMatching
                                questions={questions.filter(question => question.type === 'matching')}
                                selectedAnswers={(() => {
                                    const answers = {};
                                    questions.filter(question => question.type === 'matching').forEach(question => {
                                        if (selectedAnswers[question.questionNumber]) {
                                            answers[question.questionNumber] = selectedAnswers[question.questionNumber];
                                        } else {
                                            answers[question.questionNumber] = { questionNumber: question.questionNumber, selectedAnswer: null, isCorrect: false };
                                        }
                                    });
                                    console.log(answers);
                                    return answers;})()
                                }
                            />
                        )}
                        <div className="flex flex-row justify-between mt-4">
                            <button
                                onClick={handleRetakeTest}
                                className="bg-blue-500 hover:bg-blue-600 py-2 px-6 rounded-lg w-[calc(50%)] mr-2"
                            >Retake Test</button>
                            <button
                                onClick={() => window.location.href = `${isOffline ? '/downloads' : ''}/set/${flashcardSet._id}`}
                                className="bg-gray-500 hover:bg-gray-700 py-2 px-6 rounded-lg w-[calc(50%)]"
                            >Back to Set</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
            <Navbar isOffline={isOffline} />
            <div className="flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl mb-4 text-center">Test: {flashcardSet.title}</h1>
                <div className="w-[calc(50%)]">
                    {questionTypes.includes('multipleChoice') && (
                        <>
                            {questions.filter(question => question.type === 'multipleChoice').map((question, index) => (
                                <MultipleChoice
                                    key={index}
                                    question={question}
                                    onAnswerSelected={handleAnswerChange}
                                />
                            ))}
                        </>
                    )}
                    {questionTypes.includes('written') && (
                        <>
                            {questions.filter(question => question.type === 'written').map((question, index) => (
                                <Written
                                    key={index}
                                    question={question}
                                    onAnswerSelected={handleAnswerChange}
                                />
                            ))}
                        </>
                    )}
                    {questionTypes.includes('trueFalse') && (
                        <>
                            {questions.filter(question => question.type === 'trueFalse').map((question, index) => (
                                <TrueFalse
                                    key={index}
                                    question={question}
                                    onAnswerSelected={handleAnswerChange}
                                />
                            ))}
                        </>
                    )}
                    {questionTypes.includes('matching') && (
                        <Matching
                            questions={questions.filter(question => question.type === 'matching')}
                            onAnswerSelected={handleAnswerChange}
                        />
                    )}
                    <div className="flex flex-row justify-between mt-4">
                        <button
                            onClick={handleSubmitTest}
                            className="bg-blue-500 hover:bg-blue-600 py-2 px-6 rounded-lg w-[calc(50%)] mr-2"
                        >Submit Test</button>
                        <button
                            onClick={() => window.location.href = `${isOffline ? '/downloads' : ''}/set/${flashcardSet._id}`}
                            className="bg-gray-500 hover:bg-gray-700 py-2 px-6 rounded-lg w-[calc(50%)]"
                        >Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}