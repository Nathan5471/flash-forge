import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import { getFlashcardSet } from '../utils/FlashcardAPIHandler';
import CalcAmountPerType from '../utils/CalcAmountPerType';
import Navbar from '../components/Navbar';
import StartTest from '../components/StartTest';
import MultipleChoice from '../components/testComponents/MultipleChoice';
import Written from '../components/testComponents/Written';
import TrueFalse from '../components/testComponents/TrueFalse';
import Matching from '../components/testComponents/Matching';

export default function Test() {
    const { id } = useParams();
    const { openOverlay } = useOverlayContext();
    const [flashcardSet, setFlashcardSet] = useState(null);
    const [questionTypes, setQuestionTypes] = useState(['multipleChoice']);
    const [amountPerType, setAmountPerType] = useState({}); // Format: [startIndex, amount]
    const [possibleAnswers, setPossibleAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [readyForTest, setReadyForTest] = useState(false);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                const flashcardData = await getFlashcardSet(id);
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
                    {questionTypes.includes('multipleChoice') && (
                        <>
                            {questions.slice(amountPerType.multipleChoice[0], amountPerType.multipleChoice[0] + amountPerType.multipleChoice[1]).map((flashcard, index) => (
                                <MultipleChoice
                                    key={index}
                                    flashcard={flashcard}
                                    questionNumber={amountPerType.multipleChoice[0] + index + 1}
                                    possibleAnswers={possibleAnswers}
                                    onAnswerSelected={(answerData) => console.log('Multiple Choice Answer:', answerData)}
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
                                    questionNumber={amountPerType.written[0] + index + 1}
                                    onAnswerSelected={(answerData) => console.log('Written Answer:', answerData)}
                                />
                            ))}
                        </>
                    )}
                    {questionTypes.includes('trueFalse') && (
                        <>
                            {questions.slice(amountPerType.trueFalse[0], amountPerType.trueFalse[0] + amountPerType.trueFalse[1]).map((flashcard, index) => (
                                <TrueFalse
                                    key={index}
                                    flashcard={flashcard}
                                    questionNumber={amountPerType.trueFalse[0] + index + 1}
                                    answerChoices={possibleAnswers}
                                    onAnswerSelected={(answerData) => console.log('True/False Answer:', answerData)}
                                />
                            ))}
                        </>
                    )}
                    {questionTypes.includes('matching') && (
                        <Matching
                            flashcards={questions.slice(amountPerType.matching[0], amountPerType.matching[0] + amountPerType.matching[1])}
                            startQuestionNumber={amountPerType.matching[0] + 1}
                            onAnswerSelected={(answerData) => console.log('Matching Answer:', answerData)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}