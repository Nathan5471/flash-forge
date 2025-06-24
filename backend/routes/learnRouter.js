import express from 'express';
import { createLearnSession, checkIfLearnSessionExists } from '../controllers/learnController.js';
import { authenticate } from '../middleware/authMiddleware.js';

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
    try {
        if (!id) {
            return res.status(400).json({ message: 'Learn session ID is required' });
        }
        // TODO: Add session generation logic
    } catch (error) {
        console.error('Error in get learn session route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard set ID is required' });
        }
        // TODO: Add retrival logic
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
        // TODO: Add deletion logic
    } catch (error) {
        console.error('Error in delete learn session route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})