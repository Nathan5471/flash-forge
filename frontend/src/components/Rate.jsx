import React, { useEffect, useState } from 'react';
import { rateFlashcardSet, checkIfAlreadyRated } from '../utils/FlashcardAPIHandler';
import { useOverlayContext } from '../contexts/OverlayContext';
import { FaStar } from 'react-icons/fa';

export default function Rate({ flashcardSetId }) {
    const { closeOverlay } = useOverlayContext();
    const [rating, setRating] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPreviousRating = async () => {
            try {
                const response = await checkIfAlreadyRated(flashcardSetId);
                if (response && response.rating) {
                    setRating(response.rating);
                }
            } catch (error) {
                console.error('Error fetching previous rating:', error);
            }
        }
        fetchPreviousRating();
    }, [flashcardSetId]);

    const handleRatingChange = (e, newRating) => {
        e.preventDefault();
        setRating(newRating);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await rateFlashcardSet(flashcardSetId, rating);
            closeOverlay();
        } catch (error) {
            console.error('Error submitting rating:', error);
            setError(error.message || 'An error occurred while submitting your rating.');
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        closeOverlay();
    }

    return (
        <div className="flex flex-col w-80">
            <h2 className="text-2xl font-bold mb-4">Rate Flashcard Set</h2>
            <div className="flex flex-row mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        className={`text-3xl ${rating >= star ? 'text-primary-a0' : 'text-gray-400'}`}
                        onClick={(e) => handleRatingChange(e, star)}
                    ><FaStar /></button>
                ))}
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="flex flex-row">
                <button
                    className="bg-primary-a0 hover:bg-primary-a1 p-2 rounded-lg mr-2 w-1/2"
                    onClick={handleSubmit}
                >Submit</button>
                <button
                    className="bg-surface-a2 hover:bg-surface-a3 p-2 rounded-lg w-1/2"
                    onClick={handleCancel}
                >Cancel</button>
            </div>
        </div>
    )
}