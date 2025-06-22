import { Link } from 'react-router-dom';

export default function SetDisplay({ flashcardSet }) {
    return (
        <div className="flex flex-col bg-gray-700 text-white p-4 rounded-lg">
            <Link to={`/set/${flashcardSet._id}`} className="flex flex-col">
                <h2 className="text-xl font-bold mb-2">{flashcardSet.title}</h2>
                <p className="text-gray-300 mb-4">{flashcardSet.description}</p>
            </Link>    
            <div className="flex flex-row justify-between mt-auto">
                <p className="text-gray-400">Created by: <Link to={`/user/${flashcardSet.userId._id}`} className='hover:underline'>{flashcardSet.userId.username}</Link></p>
                <p className="text-gray-400">{flashcardSet.flashCards.length} flashcards</p>
            </div>
        </div>
    )
}