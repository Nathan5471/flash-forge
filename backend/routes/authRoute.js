import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        await registerUser(req, res);
    } catch (error) {
        console.error('Error in registration route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        await loginUser(req, res);
    } catch (error) {
        console.error('Error in login route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/', authenticate, (req, res) => {
    res.status(200).json({ message: 'Authenticated user', user: {username: req.user.username, email: req.user.email} });
});

export default router;