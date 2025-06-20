import express from 'express';
import { registerUser, loginUser, updateUsername, updateEmail, updatePassword, deleteUser, getUsername } from '../controllers/authController.js';
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

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
})

router.put('/update', authenticate, async (req, res) => {
    const { toUpdate } = req.body;
    try {
        if (!toUpdate) {
            return res.status(400).json({ message: 'You need to provide to update' });
        } else if (toUpdate === 'username') {
            updateUsername(req, res);
        } else if (toUpdate === 'email') {
            updateEmail(req, res);
        } else if (toUpdate === 'password') {
            updatePassword(req, res);
        } else {
            return res.status(400).json({ message: 'Invalid update type' });
        }
    } catch (error) {
        console.error('Error in update route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

router.delete('/delete', authenticate, async (req, res) => {
    try {
        deleteUser(req, res);
    } catch (error) {
        console.error('Error in delete route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}) 

router.get('/', authenticate, (req, res) => {
    res.status(200).json({ message: 'Authenticated user', user: {_id: req.user._id, username: req.user.username, email: req.user.email} });
});

router.get('/username/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        await getUsername(req, res);
    } catch (error) {
        console.error('Error in get username route:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;