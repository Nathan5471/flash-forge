import FlashcardSet from "../models/flashcardSet.js";

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
        res.status(200).json(flashcardSet);
    } catch (error) {
        console.error('Error fetching flashcard set:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const searchFlashcardSets = async (req, res) => {
    const { query, page, limit } = req.query;
    try {
        const searchQuery = { $text: { $search: query } };
        const matchingSets = await FlashcardSet.find(searchQuery, { score: { $meta: "textScore" } }
        ).sort({ score: { $meta: "textScore" } }).skip(page * limit).limit(Number(limit)).populate('userId', ['username', '_id']);
        res.status(200).json(matchingSets);
    } catch (error) {
        console.error('Error searching flashcard sets:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}