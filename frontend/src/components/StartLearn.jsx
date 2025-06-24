import React, { useState } from 'react';
import { useOverlayContext } from '../contexts/OverlayContext';
import { createLearnSession } from '../utils/LearnAPIHandle';

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

    const handleStart = async () => {
        if (settings.trueFalseAmount === 0 && settings.multipleChoiceAmount === 0 && settings.writtenAmount === 0) {
            setError('At least one question type must be selected.');
            return;
        }
        setError('');
        try {
            const learnSessionId = await createLearnSession(flashcardSetId, settings).learnSessionId;
            setId(learnSessionId);
            onStart();
            closeOverlay();
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
        <div className="flex flex-col p-4 w-70">
            <h1 className="text-3xl mb-4 text-center">Start Learn</h1>
        </div>
    )
}