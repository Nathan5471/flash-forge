import LeaderBoard from "../models/leaderBoard.js";
import FlashcardSet from "../models/flashcardSet.js";

export const getLeaderBoard = async (req, res) => {
    const { id } = req.params;
    try {
        const leaderBoard = await LeaderBoard.findOne({ flashcardSet: id }).populate('leaderBoard.user', 'username _id');
        if (!leaderBoard) {
            return res.status(404).json({ message: 'Leaderboard not found' });
        }
        return res.status(200).json(leaderBoard);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const getMatch = async (req, res) => {
    const { id } = req.params;
    try {
        const flashcardSet = await FlashcardSet.findById(id);
        if (!flashcardSet) {
            return res.status(404).json({ message: 'Flashcard Set not found' });
        }
        const sortedFlashcards = flashcardSet.flashCards.sort(() => Math.random() - 0.5);
        return res.status(200).json({ flashcards: sortedFlashcards.splice(0, 6) });
    } catch (error) {
        console.error('Error fetching match:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const postMatch = async (req, res) => {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    try {
        const flashcardSet = await FlashcardSet.findById(id);
        if (!flashcardSet) {
            return res.status(404).json({ message: 'Flashcard Set not found' });
        }
        const timeTaken = new Date(endTime) - new Date(startTime);
        if (timeTaken < 0) {
            return res.status(400).json({ message: 'Invalid time range' });
        }
        const leaderBoard = await LeaderBoard.findOne({ flashcardSet: id });
        if (!leaderBoard) {
            const newLeaderBoard = new LeaderBoard({
                flashcardSet: id,
                leaderBoard: [{
                    user: req.user._id,
                    time: timeTaken,
                    date: new Date()
                }]
            });
            await newLeaderBoard.save();
            const populatedNewLeaderBoard = await newLeaderBoard.populate('leaderBoard.user', 'username _id');
            return res.status(201).json(populatedNewLeaderBoard);
        }
        const existingEntry = leaderBoard.leaderBoard.find(entry => entry.user.toString() === req.user._id.toString());
        if (existingEntry) {
            if (existingEntry.time > timeTaken) {
                existingEntry.time = timeTaken;
                existingEntry.date = new Date();
                await leaderBoard.save();
            }
        } else {
            leaderBoard.leaderBoard.push({
                user: req.user._id,
                time: timeTaken,
                date: new Date(),
                rank: 0
            });
            await leaderBoard.save();
        }
        leaderBoard.leaderBoard.sort((a, b) => a.time - b.time);
        leaderBoard.leaderBoard.forEach((entry, index) => {
            entry.rank = index;
        })
        await leaderBoard.save();
        const populatedLeaderboard = await leaderBoard.populate('leaderBoard.user', 'username _id');
        return res.status(200).json(populatedLeaderboard);
    } catch (error) {
        console.error('Error posting match:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}