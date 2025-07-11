import bcrypt from 'bcrypt';
import User from '../models/user.js';
import FlashcardSet from '../models/flashcardSet.js';
import generateToken from '../utils/generateToken.js';
import Class from '../models/class.js';
import Learn from '../models/learn.js';

export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingEmail = await User.find({ email });
        const existingUsername = await User.find({ username });
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        if (existingUsername.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        })

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const doesPasswordMatch = await bcrypt.compare(password, user.password);
        if (!doesPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
        })
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateUsername = async (req, res) => {
    const { username } = req.body;
    const userId = req.user._id;

    try {
        const doesUsernameExist = await User.findOne({ username });
        if (doesUsernameExist) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, { username }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Username updated successfully', newUsername: updatedUser.username });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateEmail = async (req, res) => {
    const { email } = req.body;
    const userId = req.user._id;
    try {
        const doesEmailExist = await User.find({ email });
        if (doesEmailExist.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, { email }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Email updated successfully', newEmail: updatedUser.email });
    } catch (error) {
        console.error('Error updating email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updatePassword = async (req, res) => {
    const { newPassword } = req.body;
    const userId = req.user._id;
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteUser = async (req, res) => {
    const userId = req.user._id;

    try {
        const userFlashcardSets = await FlashcardSet.findBy({ userId: userId });
        if (userFlashcardSets.length > 0) {
            userFlashcardSets.forEach(async (flashcardSet) => {
                await FlashcardSet.findByIdAndDelete(flashcardSet._id)
            })
        }
        const userClasses = await User.findById(userId).populate('classes');
        if (userClasses.classes.length > 0) {
            userClasses.classes.forEach(async (userClass) => {
                if (userClass.teacher.toString() === userId.toString()) {
                    userClass.students.forEach(async (studentId) => {
                        const student = await User.findById(studentId);
                        if (student) {
                            student.classes = student.classes.filter(classId => classId.toString() !== userClass._id.toString());
                            await student.save();
                        }
                    })
                    await Class.findByIdAndDelete(userClass._id);
                } else {
                    const updatedclass = await Class.findByIdAndUpdate(userClass.id)
                    updatedclass.students = updatedclass.students.filter(studentId => studentId.toString() !== userId.toString());
                    await updatedclass.save();
                }
            })
        }
        const userLearn = await Learn.find({ user: userId });
        if (userLearn.length > 0) {
            userLearn.forEach(async (learn) => {
                await Learn.findByIdAndDelete(learn._id);
            })
        }
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.clearCookie('token');
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getUsername = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ username: user.username });
    } catch (error) {
        console.error('Error fetching username:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const isTeacher = async (req, res) => {
    try {
        const user = await req.user.populate('classes');
        const isTeacher = user.classes.some(userClass => userClass.teacher.toString() === user._id.toString());
        res.status(200).json({ isTeacher });
    } catch (error) {
        console.error('Error checking if user is teacher:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}