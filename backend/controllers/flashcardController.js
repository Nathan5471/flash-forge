import FlashcardSet from "../models/flashcardSet.js";
import User from "../models/user.js";
import fuse from "fuse.js";

export const createFlashcardSet = async (req, res) => {
    const { title, description, flashcards } = req.body;
    const userId = req.user._id;
    try {
        const newFlashcardSet = new FlashcardSet({
            title,
            description,
            userId,
            flashCards: flashcards,
        });
        await newFlashcardSet.save();
        res.status(201).json({ message: 'Flashcard set created successfully', flashcardSet: newFlashcardSet });
    } catch (error) {
        console.error('Error creating flashcard set:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getFlashcardSet = async (req, res) => {
    const { id } = req.params;
    try {
        const flashcardSet = await FlashcardSet.findById(id).populate('userId', ['username', '_id']);
        if (!flashcardSet) {
            return res.status(404).json({ message: 'Flashcard set not found' });
        }
        if (req.user && !req.user.recentlyViewed.includes(id)) {
            const user = await User.findById(req.user._id);
            if (user.recentlyViewed.length >= 10) {
                user.recentlyViewed.shift(); // Remove the oldest viewed set if limit is reached
            }
            user.recentlyViewed.push(id);
            await user.save();
        }
        res.status(200).json(flashcardSet);
    } catch (error) {
        console.error('Error fetching flashcard set:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const searchFlashcardSets = async (req, res) => {
    const { query, page, limit } = req.query;
    try {
        const flashcardSets = await FlashcardSet.find().populate('userId', ['username', '_id']);
        if (!flashcardSets || flashcardSets.length === 0) {
            return res.status(404).json({ message: 'No flashcard sets found' });
        }
        const fuseOptions = {
            keys: [{ name: 'title', weight: 0.7 }, { name: 'description', weight: 0.3 }],
            includeScore: true,
            threshold: 0.3,
        }
        const fuseInstance = new fuse(flashcardSets, fuseOptions);
        const results = fuseInstance.search(query);
        if (results.length === 0) {
            return res.status(404).json({ message: 'No flashcard sets found for the given query' });
        }
        const sortedResults = results.sort((a, b) => b.score - a.score);
        const filteredResults = sortedResults.slice(page * limit, (page + 1) * limit).map(result => result.item);
        res.status(200).json({searchResults: filteredResults, totalResults: results.length});
    } catch (error) {
        console.error('Error searching flashcard sets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getUserFlashcardSets = async (req, res) => {
    const { userId } = req.params;
    try {
        const flashcardSets = await FlashcardSet.find({ userId }).populate('userId', ['username', '_id']);
        if (!flashcardSets || flashcardSets.length === 0) {
            return res.status(404).json({ message: 'No flashcard sets found for this user' });
        }
        res.status(200).json(flashcardSets);
    } catch (error) {
        console.error('Error fetching user flashcard sets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getRecentFlashcardSets = async (req, res) => {
    try {
        const { recentlyViewed } = req.user;
        if (!recentlyViewed || recentlyViewed.length === 0) {
            return res.status(404).json({ message: 'No recently viewed flashcard sets found' });
        }
        const flashcardSets = await FlashcardSet.find({ _id: { $in: recentlyViewed } }).populate('userId', ['username', '_id']);
        if (!flashcardSets || flashcardSets.length === 0) {
            return res.status(404).json({ message: 'No flashcard sets found for recently viewed IDs' });
        }
        res.status(200).json(flashcardSets);
    } catch (error) {
        console.error('Error fetching recent flashcard sets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}