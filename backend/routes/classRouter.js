import express from 'express';
import { createClass, joinClass, leaveClass, deleteClass, assignFlashcardSet, unassignFlashcardSet } from '../controllers/classController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Class ID is required' });
        }
    } catch (error) {
        console.error('Error in get class route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/join/:classCode', authenticate, async (req, res) => {
    const { classCode } = req.params;
    try {
        if (!classCode) {
            return res.status(400).json({ message: 'Class Code is requried' });
        }
        await joinClass(req, res);
    } catch (error) {
        console.error('Error in join route:', error)
        return res.status(500).json({ message: 'Internal server error'});
    }
})

router.post('/leave/:classId', authenticate, async (req, res) => {
    const { classId } = req.params;
    try {
        if (!classId) {
            return res.status(400).json({ message: 'Class ID is required' });
        }
        await leaveClass(req, res);
    } catch (error) {
        console.error('Error in leave route:', error)
        return res.status(500).json({ message: 'Internal server error'});
    }
})

router.post('/create', authenticate, async (req, res) => {
    const { className, classCode } = req.body;
    try {
        if (!className || !classCode) {
            return res.status(400).json({ message: 'Class Name and Code are required' });
        }
        await createClass(req, res);
    } catch (error) {
        console.error('Error in create route:', error)
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/assign/:classId', authenticate, async (req, res) => {
    const { classId } = req.params;
    const { flashcardSetId } = req.body;
    try {
        if (!classId || !flashcardSetId) {
            return res.status(400).json({ message: 'Class ID and Flashcard Set ID are required' });
        }
        await assignFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in assign route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.post('/unassign/:classId', authenticate, async (req, res) => {
    const { classId } = req.params;
    const { flashcardSetId } = req.body;
    try {
        if (!classId || !flashcardSetId) {
            return res.status(400).json({ message: 'Class ID and Flashcard Set ID are required' });
        }
        await unassignFlashcardSet(req, res);
    } catch (error) {
        console.error('Error in unassign route:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/delete/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: 'Class ID is required' })
        }
        await deleteClass(req, res);
    } catch (error) {
        console.error('Error in delete router:')
    }
})

export default router;