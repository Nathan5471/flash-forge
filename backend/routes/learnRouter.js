import express from 'express';
import { createLearnSession, checkIfLearnSessionExists, getLearnSession, deleteLearnSession, generateLearnSession } from '../controllers/learnController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.get('/flashcardSet/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard set ID is required' });
        }
        await checkIfLearnSessionExists(req, res);
    } catch (error) {
        console.error('Error in get learn session route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/session/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    console.log('Learn session ID:', id);
    try {
        if (!id) {
            return res.status(400).json({ message: 'Learn session ID is required' });
        }
        await generateLearnSession(req, res);
    } catch (error) {
        console.error('Error in get learn session route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/check/:id/:order', authenticate, async (req, res) => {
    const { id, order } = req.params;
    const { answer } = req.query;
    try {
        if (!id || !order || !answer) {
            return res.status(400).json({ message: 'Flashcard set ID, order, and answer are required' });
        }
        // TODO: Implement logic to check if the question is correct
    } catch (error) {
        console.error('Error in check learn session route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard set ID is required' });
        }
        await getLearnSession(req, res);
    } catch (error) {
        console.error('Error in get learn session route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/', authenticate, async (req, res) => {
    const { flashcardSetId, settings } = req.body;
    try {
        if (!flashcardSetId || !settings) {
            return res.status(400).json({ message: 'Flashcard set ID and settings are required' });
        }
        await createLearnSession(req, res);
    } catch (error) {
        console.error('Error in create learn session route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Learn session ID is required' });
        }
        await deleteLearnSession(req, res);
    } catch (error) {
        console.error('Error in delete learn session route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;