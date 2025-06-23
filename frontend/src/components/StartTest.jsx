import React, { useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';

export default function StartTest({ flashcardSetData, onStartTest, isOffline = false }) {
    const { closeOverlay } = useOverlayContext();
    const [questionCount, setQuestionCount] = useState(10);
    const [questionTypes, setQuestionTypes] = useState(['multipleChoice']);

    const handleQuestionTypeChange = (e) => {
        const { value, checked } = e.target;
        setQuestionTypes(prev => {
            if (checked && !prev.includes(value)) {
                return [...prev, value];
            } else {
                return prev.filter(type => type !== value);
            }
        });
    }

    const handleStartTest = (e) => {
        e.preventDefault();
        const sortOrder = ["multipleChoice", "written", "trueFalse", "matching"];
        const sortedTypes = questionTypes.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
        if (sortedTypes.length === 0) {
            alert("Please select at least one question type.");
            return;
        }
        onStartTest(questionCount, sortedTypes);
        closeOverlay();
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
        if (isOffline) {
            window.location.href = `/downloads/set/${flashcardSetData._id}`;
        } else {
            window.location.href = `/set/${flashcardSetData._id}`;
        }
    }

    return (
        <div className="flex flex-col p-4 w-70">
            <h1 className="text-3xl mb-4 text-center">Start Test</h1>
            <h2 className="text-lg mb-2">Select the number of questions (max {flashcardSetData.flashCards.length})</h2>
            <input
                type="number"
                min="1"
                max={flashcardSetData.flashCards.length}
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
                className="mb-4 p-2 bg-gray-600 rounded-lg w-32"
            />
            <h2 className="text-lg mb-2">Select question types</h2>
            <label className="text-pretty">
                <input
                    type="checkbox"
                    value="multipleChoice"
                    checked={questionTypes.includes('multipleChoice')}
                    onChange={handleQuestionTypeChange}
                    className="mr-2"
                />
                Multiple Choice
            </label>
            <label className="text-pretty">
                <input
                    type="checkbox"
                    value="written"
                    checked={questionTypes.includes('written')}
                    onChange={handleQuestionTypeChange}
                    className="mr-2"
                />
                Written
            </label>
            <label className="text-pretty">
                <input
                    type="checkbox"
                    value="trueFalse"
                    checked={questionTypes.includes('trueFalse')}
                    onChange={handleQuestionTypeChange}
                    className="mr-2"
                />
                True/False
            </label>
            <label className="text-pretty">
                <input
                    type="checkbox"
                    value="matching"
                    checked={questionTypes.includes('matching')}
                    onChange={handleQuestionTypeChange}
                    className="mr-2"
                />
                Matching
            </label>
            <div className="flex flex-row mt-4 w-full">
                <button
                    className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg w-1/2 mr-2"
                    onClick={handleStartTest}
                >Start Test</button>
                <button
                    className="bg-gray-500 hover:bg-gray-600 p02 rounded-lg w-1/2"
                    onClick={handleCancel}
                >Cancel</button>
            </div>
        </div>
    )
}