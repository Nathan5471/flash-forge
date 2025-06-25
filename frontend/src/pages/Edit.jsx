import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUser } from '../utils/AuthAPIHandler';
import { getFlashcardSet, updateFlashcardSet } from '../utils/FlashcardAPIHandler';
import { getDownloadedFlashcardSet, editOfflineFlashcardSet } from '../utils/DownloadManager';
import Navbar from '../components/Navbar';
import { FaRegTrashAlt } from "react-icons/fa";

export default function Edit({ isOffline }) {
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
                let data;
                if (isOffline) {
                    data = await getDownloadedFlashcardSet(id);
                    if (!data._id.startsWith('local-')) {
                        navigate('/downloads');
                        return;
                    }
                } else {
                    const userData = await getUser();
                    data = await getFlashcardSet(id);
                    if (data.userId._id !== userData.user._id) {
                        navigate('/');
                        return;
                    }
                }
                setTitle(data.title);
                setDescription(data.description);
                setFlashcards(data.flashCards);
            } catch (error) {
                console.error('Error fetching flashcard set:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFlashcardSet();
    }, [id, navigate, isOffline]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const flashcardSetData = {
            title,
            description,
            flashcards: flashcards.filter(flashcard => flashcard.question && flashcard.answer)
        };
        try {
            if (isOffline) {
                await editOfflineFlashcardSet(id,flashcardSetData);
                navigate(`/downloads/set/${id}`);
            } else {
                await updateFlashcardSet(id, flashcardSetData);
                navigate(`/set/${id}`);
            }
        } catch (error) {
            console.error('Error updating flashcard set:', error);
            setError(error ? error.message : 'An error occurred while updating the flashcard set.');
        }
    }

    const handleCancel = (e) => {
        e.preventDefault();
        navigate(`${isOffline ? '/downloads' : ''}/set/${id}`);
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center">
                    <p className="text-2xl">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen w-screen bg-gray-600 text-white">
            <Navbar isOffline={isOffline} />
            <div className="flex flex-col items-center justify-center mt-6">
                <h1 className="text-4xl font-bold mb-4">Edit {`${isOffline ? 'Offline ' : ''}`}Flashcard Set</h1>
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
                                    className="w-1/2 p-2 mt-2 mr-1 bg-gray-600 rounded-lg"
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
                                    className="w-1/2 p-2 mt-2 ml-1 bg-gray-600 rounded-lg"
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
                            className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                        >Add question</button>
                    </div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <div className="flex flex-row w-full">
                        <button
                            type="submit"
                            className="mt-4 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 mr-4 w-[calc(50%)]"
                        >Update Flashcard Set</button>
                        <button
                            onClick={handleCancel}
                            className="mt-4 bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 w-[calc(50%)]"
                        >Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}