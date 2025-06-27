import express from 'express';
import { getMatch, getLeaderBoard, postMatch } from '../controllers/matchController.js';

const router = express.Router();

router.get('/leaderboard/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard Set ID is required' });
        }
        await getLeaderBoard(req, res);
    } catch (error) {
        console.error('Error in get leaderboard route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard Set ID is required' });
        }
        await getMatch(req, res);
    } catch (error) {
        console.error('Error in get match route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/:id', async (req, res) => {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    try {
        if (!id || !startTime || !endTime) {
            return res.status(400).json({ message: 'Flashcard Set ID, start time, and end time are required' });
        }
        await postMatch(req, res);
    } catch (error) {
        console.error('Error in post match route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;