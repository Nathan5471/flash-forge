import Learn from '../models/learn.js';
import FlashcardSet from '../models/flashcardSet.js';
import User from '../models/user.js';

export const createLearnSession = async (req, res) => {
    const { flashcardId, settings } = req.body;
    try {
        const flashcardSet = await FlashcardSet.findById(flashcardId);
        if (!flashcardSet) {
            return res.status(404).json({ message: 'Flashcard set not found' });
        }
        const alreadyExists = await Learn.findOne({ flashcardSet: flashcardId, user: req.user._id });
        if (alreadyExists) {
            return res.status(400).json({ message: 'Learn settings already exists for this flashcard set' });
        }
        const learnSettings = new Learn({
            flashcardSet: flashcardId,
            user: req.user._id,
            settings: settings,
            progress: flashcardSet.flashCards.map(flashcard => ({
                flashcard: flashcard,
                status: {}
            }))
        })
        await learnSettings.save();
        res.status(201).json({
            message: 'Learn session created successfully',
            learnSessionId: learnSettings._id
        })
    } catch (error) {
        console.error('Error creating learn session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const checkIfLearnSessionExists = async (req, res) => {
    const { id } = req.params; // Flashcard set ID
    try {
        const flashcardSet = await FlashcardSet.findById(id);
        if (!flashcardSet) {
            return res.status(404).json({ message: 'Flashcard set not found' });
        }
        const learnSession = await Learn.findOne({ flashcardSet: id, user: req.user._id });
        if (!learnSession) {
            return res.status(404).json({ message: 'Learn session not found for this flashcard set' });
        }
        if (new Date(learnSession.createdAt).getTime() < new Date(flashcardSet.lastEdited).getTime()) {
            return res.status(400).json({ message: 'Learn session is outdated, please create a new one' });
        }
        res.status(200).json({learnSessionId: learnSession._id });
    } catch (error) {
        console.error('Error checking learn session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getLearnSession = async (req, res) => {
    const { id } = req.params;
    try {
        const learnSession = await Learn.findById(id).populate('flashcardSet').populate('user', ['username', '_id']);
        if (!learnSession) {
            return res.status(404).json({ message: 'Learn session not found' });
        }
        res.status(200).json(learnSession);
    } catch (error) {
        console.error('Error retrieving learn session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteLearnSession = async (req, res) => {
    const { id } = req.params;
    try {
        const learnSession = await Learn.findById(id);
        if (!learnSession) {
            return res.status(404).json({ message: 'Learn session not found' });
        }
        if (learnSession.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this learn session' });
        }
        await Learn.findByIdAndDelete(id);
        res.status(200).json({ message: 'Learn session deleted successfully' });
    } catch (error) {
        console.error('Error deleting learn session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}