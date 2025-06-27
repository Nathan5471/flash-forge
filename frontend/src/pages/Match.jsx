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

    const compareCards = async (value1, value2) => {
        let flashcard;
        flashcard = flashcards.find(card => card.question === value1);
        if (flashcard && flashcard.answer === value2) {
            const newCards = randomizedCards.map(card => (card === value1 || card === value2) ? null : card);
            setRandomizedCards(newCards);
            setSelected1(null);
            setSelected2(null);
            if ([...newCards].filter(card => card !== null).length < 2) {
                setFinished(true);
                const endTime = new Date();
                setEndTime(endTime);
                let leaderBoardData;
                if (isOffline) {
                    leaderBoardData = await postOfflineMatch(id, startTime, endTime);
                } else {
                    leaderBoardData = await postMatch(id, startTime, endTime);
                }
                if (leaderBoardData.leaderBoard.length > 10) {
                    leaderBoardData.leaderBoard = leaderBoardData.leaderBoard.slice(0, 10);
                }
                setLeaderBoard(leaderBoardData.leaderBoard);
            }
            return;
        } else if (flashcard) {
            setSelected1(null);
            setSelected2(null);
            return;
        }
        flashcard = flashcards.find(card => card.answer === value1);
        if (flashcard && flashcard.question === value2) {
            const newCards = randomizedCards.map(card => (card === value1 || card === value2) ? null : card);
            setRandomizedCards(newCards);
            setSelected1(null);
            setSelected2(null);
            if ([...newCards].filter(card => card !== null).length < 2) {
                setFinished(true);
                const endTime = new Date();
                setEndTime(endTime);
                let leaderBoardData;
                if (isOffline) {
                    leaderBoardData = await postOfflineMatch(id, startTime, endTime);
                } else {
                    leaderBoardData = await postMatch(id, startTime, endTime);
                }
                if (leaderBoardData.leaderBoard.length > 10) {
                    leaderBoardData.leaderBoard = leaderBoardData.leaderBoard.slice(0, 10);
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
            compareCards(selected1, value);
        } else {
            setSelected1(null);
            setSelected2(null);
        }
    }

    const handleReset = (e) => {
        e.preventDefault();
        setSelected1(null);
        setSelected2(null);
        setRandomizedCards(null);
        setFinished(false);
        setPreGame(true);
        setStartTime(null);
        setEndTime(null);
        setLeaderBoard([]);
        setLoading(true);
        setFlashcards([]);
    }

    if (loading) {
        return (
            <div className="flex flex-col h-screen w-screen bg-tonal-a0 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg">Loading...</p>
                </div>
            </div>
        )
    }

    if (preGame) {
        return (
            <div className="flex flex-col h-screen w-screen bg-tonal-a0 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col w-75 items-center p-4 rounded-lg bg-surface-a1">
                        <h1 className="text-4xl text-primary-a0 font-bold mb-4">Match Game</h1>
                        <p className="text-lg mb-4">You will be given questions and answers, match them to win!</p>
                        <button
                            onClick={handleStart}
                            className="bg-primary-a0 hover:bg-primary-a1 p-2 w-full rounded-lg"
                        >Start</button>
                    </div>
                </div>
            </div>
        )
    }

    if (finished) {
        return (
            <div className="flex flex-col h-screen w-screen bg-tonal-a0 text-white">
                <Navbar isOffline={isOffline} />
                <div className="flex items-center justify-center h-full">
                    <div className="flex flex-row items-center justify-center p-4 rounded-lg bg-surface-a1 w-[calc(50%)]">
                        <div className="flex flex-col items-center w-[calc(50%)]">
                            <h2 className="text-2xl text-primary-a0 font-bold mb-4">Leaderboard</h2>
                            <ol className="list-decimal list-inside mb-4">
                                {leaderBoard.map((entry, index) => (
                                    <li key={index} className="mb-2">
                                        <span className="font-bold">{entry.user.username}</span> - {(entry.time / 1000).toFixed(0)} seconds
                                    </li>
                                ))}
                            </ol>
                        </div>
                        <div className="flex flex-col items-center w-[calc(50%)]">
                            <h2 className="text-2xl text-primary-a0 font-bold mb-4">Game Over</h2>
                            <p className="mb-4">You have matched all cards!</p>
                            <p className="mb-4">Time taken: <span className="text-lg text-primary-a0 text-bold">{((endTime - startTime) / 1000).toFixed(0)}</span> seconds</p>
                            <div className="flex flex-row">
                                <button
                                    onClick={handleReset}
                                    className="bg-primary-a0 hover:bg-primary-a1 p-2 w-full rounded-lg mr-2"
                                >Play again</button>
                                <button
                                    onClick={() => window.location.href = `${isOffline ? '/downloads' : ''}/set/${id}`}
                                    className="bg-surface-a2 hover:bg-surface-a3 p-2 w-full rounded-lg"
                                >Back to Set</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen w-screen bg-tonal-a0 text-white">
            <Navbar isOffline={isOffline} />
            <div className="flex items-center justify-center h-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 w-[calc(80%)] h-full">
                    {randomizedCards.map((card, index) => {
                        if (card === null) return <div key={index}></div>;
                        return (
                            <button
                                key={index}
                                onClick={(e) => handleCardClick(e, card)}
                                className={`p-4  rounded-lg ${(selected1 === card || selected2 === card) ? 'bg-primary-a0 hover:bg-primary-a1' : 'bg-surface-a2 hover:bg-surface-a3'}`}
                            >{card}</button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}