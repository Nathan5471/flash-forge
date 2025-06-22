import { Link } from "react-router-dom";

export default function SetDisplay({ flashcardSet }) {
    return (
        <Link to={`/downloads/set/${flashcardSet._id}`} className="flex flex-col bg-gray-700 text-white p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-2">{flashcardSet.title}</h2>
            <p className="text-gray-300 mb-4">{flashcardSet.description}</p>
            <p className="text-gray-400">{flashcardSet.flashCards.length} flashcards</p>
        </Link>
    )
}