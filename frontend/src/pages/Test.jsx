import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getFlashcardSet } from '../utils/FlashcardAPIHandler';
import Navbar from '../components/Navbar';
import StartTest from '../components/StartTest';
import MultipleChoice from '../components/testComponents/MultipleChoice';

export default function Test() {
    const { id } = useParams();
    const { openOverlay } = useOverlayContext();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [questionCount, setQuestionCount] = useState(0);
    const [questionTypes, setQuestionTypes] = useState(['multipleChoice']);
    const [possibleAnswers, setPossibleAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [readyForTest, setReadyForTest] = useState(false);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                const flashcardData = await getFlashcardSet(id);
                console.log('Flashcard Data:', flashcardData);
                setFlashcardSet(flashcardData);
                if (flashcardData && flashcardData.flashCards) {
                    console.log('Getting possible answers from flashcard data');
                    const answers = flashcardData.flashCards.map(card => card.answer);
                    console.log(answers)
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
                setQuestionCount(amount);
                setQuestionTypes(types);
                const shuffledQuestions = flashcardSet.flashCards.sort(() => Math.random() - 0.5);
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
                />
            );
        }
    }, [flashcardSet, loading, openOverlay, isPopupOpen, readyForTest]);

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
                {questions.map((flashcard, index) => (
                    <MultipleChoice
                        key={index}
                        flashcard={flashcard}
                        questionNumber={index + 1}
                        possibleAnswers={possibleAnswers}
                        onAnswerSelected={(answerData) => {
                            console.log(`Question ${answerData.questionNumber}: Selected Answer - ${answerData.selectedAnswer}, Correct - ${answerData.isCorrect}`);
                        }}
                    />
                ))}
                </div>
            </div>
        </div>
    )
}