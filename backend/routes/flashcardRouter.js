import express from 'express';
import { createFlashcardSet, getFlashcardSet, searchFlashcardSets, getUserFlashcardSets, getRecentFlashcardSets, getRecentlyCreatedFlashcardSets, updateFlashcardSet, deleteFlashcardSet, cloneFlashcardSet, getLastEditTime, getRandomFlashcards, rateFlashcardSet, getFlashcardSetRating, addCommentToFlashcardSet, getFlashcardSetComments, deleteCommentFromFlashcardSet } from '../controllers/flashcardController.js';
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

router.post('/clone/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const { newTitle } = req.body;
    try {
        if (!id || !newTitle) {
            return res.status(400).json({ message: 'Flashcard set ID and new title are required' });
        }
        await cloneFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in clone flashcard set route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/lastEdit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard set ID is required' });
        }
        await getLastEditTime(req, res);
    } catch (error) {
        console.error('Error in get last edit time route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/random/:id', async (req, res) => {
    const { id } = req.params;
    const { amount, excludeFlashcardId } = req.query;
    try {
        if (!id || !amount) {
            return res.status(400).json({ message: 'Flashcard set ID and amount are required' });
        }
        await getRandomFlashcards(req, res);
    } catch (error) {
        console.error('Error in get random flashcards route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/:id/rating', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard set ID is required' });
        }
        await getFlashcardSetRating(req, res);
    } catch (error) {
        console.error('Error in get flashcard set rating route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Flashcard set ID is required' });
        }
        await getFlashcardSetComments(req, res);
    } catch (error) {
        console.error('Error in get flashcard set comments route:', error);
        return res.status(500).json({ message: 'Internal server error'});
    }
})

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

router.post('/:id/rate', authenticate, async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    try {
        if (!id || !rating) {
            return res.status(400).json({ message: 'Flashcard set ID and rating are required' });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        await rateFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in rate flashcard set route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/:id/comment', authenticate, async ( req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    try {
        if (!id || !comment) {
            return res.status(400).json({ message: 'Flashcard set ID and comment are required' });
        }
        await addCommentToFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in comment flashcard set route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/:id/comment/:commentId', authenticate, async (req, res) => {
    const { id, commentId } = req.params;
    try {
        if (!id || !commentId) {
            return res.status(400).json({ message: 'Flashcard set ID and comment ID are required' });
        }
        await deleteCommentFromFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in delete comment from flashcard set route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

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