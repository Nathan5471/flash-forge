import React, { useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';
import { createLearnSession } from '../utils/LearnAPIHandler';

export default function StartLearn({ flashcardSetId, onStart, setId }) {
    const { closeOverlay } = useOverlayContext();
    const [settings, setSettings] = useState({
        amountPerSession: 10,
        trueFalseAmount: 0,
        multipleChoiceAmount: 0,
        writtenAmount: 0,
    })
    const [error, setError] = useState('');

    const handleChange = (e, setting) => {
        const value = e.target.value;
        switch (setting) {
            case 'amountPerSession':
                setSettings(prev => ({ ...prev, amountPerSession: value }));
                break;
            case 'trueFalseAmount':
                setSettings(prev => ({ ...prev, trueFalseAmount: value }));
                break;
            case 'multipleChoiceAmount':
                setSettings(prev => ({ ...prev, multipleChoiceAmount: value }));
                break;
            case 'writtenAmount':
                setSettings(prev => ({ ...prev, writtenAmount: value }));
                break;
            default:
                break;
        } 
    }

    const handleStart = async (e) => {
        e.preventDefault();
        if (settings.trueFalseAmount === 0 && settings.multipleChoiceAmount === 0 && settings.writtenAmount === 0) {
            setError('At least one question type must be selected.');
            return;
        }
        setError('');
        try {
            const learnSessionId = await createLearnSession(flashcardSetId, settings);
            console.log('Learn session created:', learnSessionId);
            console.log('Learn session ID:', learnSessionId.learnSessionId);
            if (learnSessionId.learnSessionId) {
                setId(learnSessionId.learnSessionId);
                onStart();
                closeOverlay();
                return;
            }
            setError('Failed to create learn session. Please try again.');
        } catch (error) {
            console.error('Error creating learn session:', error);
            setError(error.message || 'An error occurred while starting the learn session.');
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
        window.location.href = `/set/${flashcardSetId}`;
    }

    return (
        <div className="flex flex-col w-70">
            <h1 className="text-3xl mb-2 text-center">Start Learn</h1>
            <form className="flex flex-col" onSubmit={handleStart}>
                <label className="text-lg mb-2">Amount Per Session:</label>
                <input
                    type="number"
                    value={settings.amountPerSession}
                    onChange={(e) => handleChange(e, 'amountPerSession')}
                    min={1}
                    required
                    className="p-2 rounded bg-gray-600 mb-4"
                />
                <label className="text-lg mb-2">True/False Rounds:</label>
                <input
                    type="number"
                    value={settings.trueFalseAmount}
                    onChange={(e) => handleChange(e, 'trueFalseAmount')}
                    min={0}
                    required
                    className="p-2 rounded bg-gray-600 mb-4"
                />
                <label className="text-lg mb-2">Multiple Choice Rounds:</label>
                <input
                    type="number"
                    value={settings.multipleChoiceAmount}
                    onChange={(e) => handleChange(e, 'multipleChoiceAmount')}
                    min={0}
                    required
                    className="p-2 rounded bg-gray-600 mb-4"
                />
                <label className="text-lg mb-2">Written Rounds:</label>
                <input
                    type="number"
                    value={settings.writtenAmount}
                    onChange={(e) => handleChange(e, 'writtenAmount')}
                    min={0}
                    required
                    className="p-2 rounded bg-gray-600 mb-4"
                />
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <div className="flex flex-row justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 p-2 rounded-lg w-1/2 mr-2"
                    >Start</button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="bg-gray-500 hover:bg-gray-600 p-2 rounded-lg w-1/2"
                    >Cancel</button>
                </div>
            </form>
            
        </div>
    )
}