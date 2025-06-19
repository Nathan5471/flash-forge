import FlashcardSet from "../models/flashcardSet";

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