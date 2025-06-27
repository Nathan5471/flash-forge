import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMatch, postMatch } from '../utils/MatchAPIHandler';
import { getOfflineMatch, postOfflineMatch } from '../utils/OfflineMatchHandler';
import Navbar from '../components/Navbar';

export default function Match({ isOffline = false }) {
    const { id } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [randomizedCards, setRandomizedCards] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [preGame, setPreGame] = useState(true);
    const [finished, setFinished] = useState(false);
    const [selected1, setSelected1] = useState(null);
    const [selected2, setSelected2] = useState(null);
    const [leaderBoard, setLeaderBoard] = useState([]);

    useEffect(() => {
        const fetchMatch = async () => {
            try {
                let data;
                if (isOffline) {
                    data = await getOfflineMatch(id);
                } else {
                    data = await getMatch(id);
                }
                setFlashcards(data.flashcards);
                const shuffledFlashcards = [...data.flashcards].sort(() => Math.random() - 0.5);
                const questions = shuffledFlashcards.map(card => card.question);
                const answer = shuffledFlashcards.map(card => card.answer);
                const combined = questions.concat(answer);
                const shuffledCombined = combined.sort(() => Math.random() - 0.5);
                setLoading(false);
                setRandomizedCards(shuffledCombined);
            } catch (error) {
                console.error('Error fetching match:', error);
                setLoading(false);
            }
        }
        if (loading) {
            fetchMatch();
        }
    }, [id, isOffline, loading]);

    const handleStart = () => {
        setStartTime(new Date());
        setPreGame(false);
        setFinished(false);
    }

    const compareCards = async () => {
        if (!selected1 || !selected2) return;
        let flashcard;
        flashcard = flashcards.find(card => card.question === selected1);
        if (flashcard && flashcard.answer === selected2) {
            setRandomizedCards(prevCards => prevCards.filter(card => card !== selected1 || card !== selected2));
            setSelected1(null);
            setSelected2(null);
            if (flashcards.length <= 2) {
                setFinished(true);
                setEndTime(new Date());
                let leaderBoardData;
                if (isOffline) {
                    leaderBoardData = await postOfflineMatch(id, startTime, endTime);
                } else {
                    leaderBoardData = await postMatch(id, startTime, endTime);
                }
                setLeaderBoard(leaderBoardData.leaderBoard);
            }
            return;
        } else if (flashcard) {
            setSelected1(null);
            setSelected2(null);
            return;
        }
        flashcard = flashcards.find(card => card.answer === selected1);
        if (flashcard && flashcard.question === selected2) {
            setRandomizedCards(prevCards => prevCards.filter(card => card !== selected1 || card !== selected2));
            setSelected1(null);
            setSelected2(null);
            if (flashcards.length <= 2) {
                setFinished(true);
                setEndTime(new Date());
                let leaderBoardData;
                if (isOffline) {
                    leaderBoardData = await postOfflineMatch(id, startTime, endTime);
                } else {
                    leaderBoardData = await postMatch(id, startTime, endTime);
                }
                setLeaderBoard(leaderBoardData.leaderBoard);
            }
            return;
        }
        setSelected1(null);
        setSelected2(null);
        return;
    }

    const handleCardClick = (e, value) => {
        e.preventDefault();
        if (selected1 === null) {
            setSelected1(value);
        } else if (selected2 === null && value !== selected1) {
            setSelected2(value);
            compareCards();
        } else {
            setSelected1(value);
            setSelected2(null);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        )
    }

    if (preGame) {
        return (
            <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-gray-700">
                        <h1 className="text-2xl mb-4">Match Game</h1>
                        <p className="mb-4">You will be given questions and answers, match them to win!</p>
                        <button
                            onClick={handleStart}
                            className="bg-blue-500 hover:bg-blue-600 p-2 w-full rounded-lg"
                        >Start</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-gray-600 text-white">
            <Navbar isOffline={isOffline} />
            <div className="flex items-center justify-center h-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                    {randomizedCards.map((card, index) => (
                        <button
                            key={index}
                            onClick={(e) => handleCardClick(e, card)}
                            className={`p-4  rounded-lg ${(selected1 === card || selected2 === card) ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-800'}`}
                        >{card}</button>
                    ))}
                </div>
            </div>
        </div>
    )
}