import { Link } from 'react-router-dom';
import { useOverlayContext } from '../contexts/OverlayContext';
import DeleteFlashcardSet from './DeleteFlashcardSet';

export default function SetDisplay({ flashcardSet, isOffline = false }) {
    const { openOverlay } = useOverlayContext();

    const handleDelete = (e) => {
        e.preventDefault();
        openOverlay(<DeleteFlashcardSet id={flashcardSet._id} isOffline={isOffline} />);
    }

    return (
        <div className="flex flex-col bg-gray-700 text-white p-4 rounded-lg">
            <Link to={`${isOffline ? "/downloads" : ""}/set/${flashcardSet._id}`} className="flex flex-col">
                <h2 className="text-xl font-bold mb-2">{flashcardSet.title}</h2>
                <p className="text-gray-300 mb-4">{flashcardSet.description}</p>
            </Link>    
            <div className="flex flex-row justify-between mt-auto">
                <p className="text-gray-400">Created by: <Link to={`${isOffline ? "/downloads" : ""}/user/${flashcardSet.userId._id}`} className='hover:underline'>{flashcardSet.userId.username}</Link></p>
                <p className="text-gray-400">{flashcardSet.flashCards.length} flashcards</p>
            </div>
            {isOffline && (
                <button className="mt-4 bg-red-500 hover:bg-red-600 py-2 px-4 rounded" onClick={handleDelete}>Delete</button>
            )}
        </div>
    )
}