import express from 'express';
import { createClass, joinClass, leaveClass, deleteClass } from '../controllers/classController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.post('/join', authenticate, async (req, res) => {
    const { classId } = req.body;
    try {
        if (!classId) {
            return res.status(400).json({ message: 'Class ID is requried' });
        }
        await joinClass(req, res);
    } catch (error) {
        console.error('Error in join route:', error)
        return res.status(500).json({ message: 'Internal server error'});
    }
})

router.post('/leave', authenticate, async (req, res) => {
    const { classId } = req.body;
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
    const { className } = req.body;
    try {
        if (!className) {
            return res.status(400).json({ message: 'Class Name is required' });
        }
        await createClass(req, res);
    } catch (error) {
        console.error('Error in create route:', error)
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