import express from 'express';
import { createFlashcardSet } from '../controllers/flashcardController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.post('/create', authenticate, async (req, res) => {
    const { title, description, flashcards } = req.body;
    try {
        if (!title || !description || !flashcards) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        await createFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in create flashcard set route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;