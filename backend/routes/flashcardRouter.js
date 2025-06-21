import express from 'express';
import { createFlashcardSet, getFlashcardSet, searchFlashcardSets, getUserFlashcardSets, getRecentFlashcardSets, getRecentlyCreatedFlashcardSets, updateFlashcardSet, deleteFlashcardSet } from '../controllers/flashcardController.js';
import authenticate from '../middleware/authenticate.js';
import nonRequiredAuthenticate from '../middleware/nonRequiredAuthenticate.js';

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

router.get('/user/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        await getUserFlashcardSets(req, res);
    } catch (error) {
        console.error('Error in get user flashcard sets route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/search', async (req, res) => {
    const { query, page, limit } = req.query;
    try {
        if (!query || !page || !limit) {
            return res.status(400).json({ message: 'Query, page, and limit are required' });
        }
        await searchFlashcardSets(req, res);
    } catch (error) {
        console.error('Error in search flashcard sets route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/recents', authenticate, async (req, res) => {
    if (!req.user.recentlyViewed || req.user.recentlyViewed.length === 0) {
        return res.status(404).json({ message: 'No recently viewed flashcard sets found' });
    }
    await getRecentFlashcardSets(req, res);
});

router.get('/recentlyCreated', async (req, res) => {
    try {
        await getRecentlyCreatedFlashcardSets(req, res);
    } catch (error) {
        console.error('Error in get recently created flashcard sets route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/:id', nonRequiredAuthenticate, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard set ID is required' });
        }
        await getFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in get flashcard set route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { title, description, flashcards } = req.body;
    try {
        if (!id || !title || !description || !flashcards) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        await updateFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in update flashcard set route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard set ID is required' });
        }
        await deleteFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in delete flashcard set route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

export default router;