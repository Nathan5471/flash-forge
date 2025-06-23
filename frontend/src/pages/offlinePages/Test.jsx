import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayContext } from '../../contexts/OverlayContext';
import { getDownloadedFlashcardSet } from '../../utils/DownloadManager';
import CalcAmountPerType from '../../utils/CalcAmountPerType';
import Navbar from '../../components/offlineComponents/Navbar';
import StartTest from '../../components/startTest';
import MultipleChoice from '../../components/testComponents/MultipleChoice';
import Written from '../../components/testComponents/Written';
import TrueFalse from '../../components/testComponents/TrueFalse';
import Matching from '../../components/testComponents/Matching';
import UnansweredQuestionsPopup from '../../components/testComponents/UnansweredQuestionsPopup';
import GradePopup from '../../components/testComponents/GradePopup';

export default function Test() {
    const { id } = useParams();
    const { openOverlay } = useOverlayContext();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [questionTypes, setQuestionTypes] = useState(['multipleChoice']);
    const [amountPerType, setAmountPerType] = useState({}); // Format: [startIndex, amount]
    const [possibleAnswers, setPossibleAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [readyForTest, setReadyForTest] = useState(false);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                const flashcardData = getDownloadedFlashcardSet(id);
                setFlashcardSet(flashcardData);
                if (flashcardData && flashcardData.flashCards) {
                    const answers = flashcardData.flashCards.map(card => card.answer);
                    setPossibleAnswers(answers);
                }
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
        if (flashcardSet && loading === false && readyForTest === false && !isPopupOpen) {
            const handleAddTestInfo = (amount, types) => {
                setQuestionTypes(types);
                setAmountPerType(CalcAmountPerType(types, amount));
                const shuffledQuestions = [...flashcardSet.flashCards].sort(() => Math.random() - 0.5);
                const selectedQuestions = shuffledQuestions.slice(0, amount);
                setQuestions(selectedQuestions);
                setReadyForTest(true);
                setIsPopupOpen(false);
                setReadyForTest(true);
            }
            setIsPopupOpen(true);
            openOverlay(
                <StartTest
                    flashcardSetData={flashcardSet}
                    onStartTest={handleAddTestInfo}
                    isOffline={true}
                />
            )
        }
    }, [flashcardSet, loading, openOverlay, isPopupOpen, readyForTest]);

    const handleAnswerChange = (answerData) => {
        const newSelectedAnswers = { ...selectedAnswers };
        newSelectedAnswers[answerData.questionNumber] = answerData;
        setSelectedAnswers(newSelectedAnswers);
    }

    const gradeTest = () => {
        const correctAnswers = Object.values(selectedAnswers).filter(answer => answer.isCorrect).length;
        const totalQuestions = questions.length;
        const score = (correctAnswers / totalQuestions) * 100;
        openOverlay(
            <GradePopup
                id={flashcardSet._id}
                grade={Math.round(score)}
                questionCount={totalQuestions}
                correctAnswerCount={correctAnswers}
                isOffline={true}
            />
        );
    }

    const handleSubmitTest = () => {
        const answerCount = Object.keys(selectedAnswers).length;
        if (answerCount < questions.length) {
            openOverlay(
                <UnansweredQuestionsPopup
                    unansweredCount={questions.length - answerCount}
                    onConfirm={gradeTest}
                />
            );
        } else {
            gradeTest();
        }
    }

    if (loading || !readyForTest) {
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
        <div className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl mb-4 text-center">Test: {flashcardSet.title}</h1>
                <div className="w-[calc(50%)]">
                    {questionTypes.includes('multipleChoice') && (
                        <>
                            {questions.slice(amountPerType.multipleChoice[0], amountPerType.multipleChoice[0] + amountPerType.multipleChoice[1]).map((flashcard, index) => (
                                <MultipleChoice
                                    key={index}
                                    flashcard={flashcard}
                                    questionNumber={amountPerType.multipleChoice[0] + index}
                                    possibleAnswers={possibleAnswers}
                                    onAnswerSelected={handleAnswerChange}
                                />
                            ))}
                        </>
                    )}
                    {questionTypes.includes('written') && (
                        <>
                            {questions.slice(amountPerType.written[0], amountPerType.written[0] + amountPerType.written[1]).map((flashcard, index) => (
                                <Written
                                    key={index}
                                    flashcard={flashcard}
                                    questionNumber={amountPerType.written[0] + index}
                                    onAnswerSelected={handleAnswerChange}
                                />
                            ))}
                        </>
                    )}
                    {questionTypes.includes('trueFalse') && (
                        <>
                            {questions.slice(amountPerType.trueFlase[0], amountPerType.trueFalse[0] + amountPerType.trueFalse[1]).map((flashcard, index) => (
                                <TrueFalse
                                    key={index}
                                    flashcard={flashcard}
                                    questionNumber={amountPerType.trueFalse[0] + index}
                                    answerChoices={possibleAnswers}
                                    onAnswerSelected={handleAnswerChange}
                                />
                            ))}
                        </>
                    )}
                    {questionTypes.includes('matching') && (
                        <Matching
                            flashcards={questions.slice(amountPerType.matching[0], amountPerType.matching[0] + amountPerType.matching[1])}
                            startQuestionNumber={amountPerType.matching[0] + 1}
                            onAnswerSelected={handleAnswerChange}
                        />
                    )}
                    <div className="flex flex-row justify-between mt-4">
                        <button
                            onClick={handleSubmitTest}
                            className="bg-blue-500 hover:bg-blue-600 py-2 px-6 rounded-lg w-[calc(50%)] mr-2"
                        >Submit Test</button>
                        <button
                            onClick={() => window.location.href = `/downloads/set/${id}`}
                            className="bg-gray-500 hover:bg-gray-600 py-2 px-6 rounded-lg w-[calc(50%)] ml-2"
                        >Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}