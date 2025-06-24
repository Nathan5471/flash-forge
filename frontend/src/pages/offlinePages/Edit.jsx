import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDownloadedFlashcardSet, editOfflineFlashcardSet } from '../../utils/DownloadManager';
import Navbar from '../../components/offlineComponents/Navbar';
import { FaRegTrashAlt } from 'react-icons/fa';

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [flashcards, setFlashcards] = useState([{ question: '', answer: '' }]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlashcardSet = async () => {
            try {
                const data = getDownloadedFlashcardSet(id);
                if (!data) {
                    setError('Flashcard set not found');
                    return;
                }
                if (data._id.startsWith('local-')) {
                    setTitle(data.title);
                    setDescription(data.description);
                    setFlashcards(data.flashCards);
                } else {
                    navigate('/downloads');
                    return;
                }
            } catch (error) {
                console.error('Error fetching flashcard set:', error);
                setError('Failed to fetch flashcard set');
            } finally {
                setLoading(false);
            }
        }
        fetchFlashcardSet();
    }, [id, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const flashcardSetData = {
            newTitle: title,
            newDescription: description,
            newFlashCards: flashcards.filter(flashcard => flashcard.question && flashcard.answer)
        };
        try {
            const updatedSet = editOfflineFlashcardSet(id, flashcardSetData);
            if (updatedSet) {
                navigate(`/downloads/set/${updatedSet._id}`);
            } else {
                setError('Failed to update flashcard set');
            }
        } catch (error) {
            console.error('Error updating flashcard set:', error);
            setError(error.message || 'An error occurred while updating the flashcard set.');
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        navigate(`/downloads/set/${id}`);
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar />
                <div className="flex items-center justify-center">
                    <p className="text-2xl">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <dikv className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
            <Navbar />
            <div className="flex flex-col items-center justify-center mt-6">
                <h1 className="text-4xl font-bold mb-4">Edit Offline Flashcard Set</h1>
                <form className="w-1/2 bg-gray-700 p-6 rounded-lg shadow-lg" onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-2xl mb-2">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter title"
                            className="w-full p-2 mt-2 bg-gray-600 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-2xl mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter description"
                            className="w-full p-2 mt-2 bg-gray-600 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-2xl mb-2">Questions</label>
                        <div className="flex flex-row justify-around mb-2">
                            <p className="text-lg">Question</p>
                            <p className="text-lg">Answer</p>
                        </div>
                        {flashcards.map((flashcard, index) => (
                            <div key={index} className="flex flex-row items-center justify-center mb-2">
                                <p className="text-lg mr-2">{index + 1}.</p>
                                <input
                                    type="text"
                                    value={flashcard.question}
                                    onChange={(e) => {
                                        const newFlashcards = [...flashcards];
                                        newFlashcards[index].question = e.target.value;
                                        setFlashcards(newFlashcards);
                                    }}
                                    placeholder="Enter question"
                                    className="w-1/2 p-2 mt-2 bg-gray-600 rounded-lg mr-2"
                                />
                                <input
                                    type="text"
                                    value={flashcard.answer}
                                    onChange={(e) => {
                                        const newFlashcards = [...flashcards];
                                        newFlashcards[index].answer = e.target.value;
                                        setFlashcards(newFlashcards);
                                    }}
                                    placeholder="Enter answer"
                                    className="w-1/2 p-2 mt-2 bg-gray-600 rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newFlashcards = flashcards.filter((_, i) => i !== index);
                                        setFlashcards(newFlashcards);
                                    }}
                                    className="ml-2 hover:text-gray-300"
                                ><FaRegTrashAlt /></button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => setFlashcards([...flashcards, { question: '', answer: '' }])}
                            className="mt-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-lg"
                        >Add question</button>
                    </div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <div className="flex flex-row w-full">
                        <button
                            type="submit"
                            className="mt-4 bg-green-500 hover:bg-green-600 p-2 rounded-lg w-[calc(50%)] mr-4"
                        >Update Flashcard Set</button>
                        <button
                            onClick={handleCancel}
                            className="mt-4 bg-gray-500 hover:bg-gray-600 p-2 rounded-lg w-[calc(50%)]"
                        >Cancel</button>
                    </div>
                </form>
            </div>
        </dikv>
    )
}