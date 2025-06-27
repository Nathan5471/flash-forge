import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMatch, postMatch } from '../utils/MatchAPIHandler';
import { getOfflineMatch, postOfflineMatch } from '../utils/OfflineMatchHandler';

export default function Match({ isOffline = false }) {
    const { id } = useParams();
    const [flashcards, setFlashcards] = useState([]);
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
                if (isOffline) {
                    const data = await getOfflineMatch(id);
                    setFlashcards(data.flashcards);
                } else {
                    const data = await getMatch(id);
                    setFlashcards(data.flashcards);
                }
                setLoading(false);
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
        const flashcard = flashcards.find(card => card.question === selected1);
        if (flashcard && flashcard.answer === selected2) {
            setFlashcards(prev => prev.filter(card => card.question !== selected1 && card.answer !== selected2));
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
        }
    }

    const handleCardClick = (value) => {
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
}