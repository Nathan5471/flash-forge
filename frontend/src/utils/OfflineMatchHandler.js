const internalGetFlashcardSet = (flashcardSetId) => {
    const flashcardSet = localStorage.getItem(`flashcardSet-${flashcardSetId}`);
    if (!flashcardSet) {
        return null;
    }
    return JSON.parse(flashcardSet);
}

const internalGetLeaderBoard = (leaderBoardId) => {
    const leaderBoard = localStorage.getItem(`leaderboard-${leaderBoardId}`);
    if (!leaderBoard) {
        return null;
    }
    return JSON.parse(leaderBoard);
}

export const getOfflineMatch = async (id) => {
    try {
        if (id === undefined) {
            return Promise.reject({ message: 'ID is required' });
        }
        const flashcardSet = internalGetFlashcardSet(id);
        if (!flashcardSet) {
            return Promise.reject({ message: 'Flashcard set not found' });
        }
        const sortedFlashcards = flashcardSet.flashCards.sort(() => Math.random() - 0.5);
        return { flashcards: sortedFlashcards.splice(0, 6) };
    } catch (error) {
        console.error('Error fetching match:', error);
        return Promise.reject({ message: 'Internal server error' });
    }
}

export const getOfflineLeaderBoard = async (id) => {
    try {
        if (id === undefined) {
            return Promise.reject({ message: 'ID is required' });
        }
        const leaderBoard = internalGetLeaderBoard(id);
        if (!leaderBoard) {
            return Promise.reject({ message: 'Leaderboard not found' });
        }
        return leaderBoard;
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return Promise.reject({ message: 'Internal server error' });
    }
}

export const postOfflineMatch = async (id, startTime, endTime) => {
    try {
        if (id === undefined || !startTime || !endTime) {
            return Promise.reject({ message: 'ID, startTime, and endTime are required' });
        }
        const flashcardSet = internalGetFlashcardSet(id);
        if (!flashcardSet) {
            return Promise.reject({ message: 'Flashcard set not found' });
        }
        const timeTaken = new Date(endTime) - new Date(startTime);
        if (timeTaken < 0) {
            return Promise.reject({ message: 'Invalid time range' });
        }
        const leaderBoard = internalGetLeaderBoard(id);
        if (!leaderBoard) {
            const newLeaderBoard = {
                flashcardSet: id,
                leaderBoard: [{
                    user: 'local-user',
                    time: timeTaken,
                    date: new Date(),
                    rank: 0
                }]
            };
            localStorage.setItem(`leaderboard-${id}`, JSON.stringify(newLeaderBoard));
            return newLeaderBoard;
        }
        leaderBoard.leaderBoard.push({
            user: 'local-user',
            time: timeTaken,
            date: new Date(),
            rank: undefined
        })
        leaderBoard.leaderBoard.sort((a, b) => a.time - b.time);
        leaderBoard.leaderBoard.forEach((entry, index) => {
            entry.rank = index;
        })
        localStorage.setItem(`leaderboard-${id}`, JSON.stringify(leaderBoard));
        return leaderBoard;
    } catch (error) {
        console.error('Error posting match:', error);
        return Promise.reject({ message: 'Internal server error' });
    }
}