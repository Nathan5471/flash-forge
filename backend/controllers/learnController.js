import Learn from '../models/learn.js';
import FlashcardSet from '../models/flashcardSet.js';

export const createLearnSession = async (req, res) => {
    const { flashcardSetId, settings } = req.body;
    try {
        const flashcardSet = await FlashcardSet.findById(flashcardSetId);
        if (!flashcardSet) {
            return res.status(404).json({ message: 'Flashcard set not found' });
        }
        const alreadyExists = await Learn.findOne({ flashcardSet: flashcardSetId, user: req.user._id });
        if (alreadyExists) {
            return res.status(400).json({ message: 'Learn settings already exists for this flashcard set' });
        }
        const questions = [];
        let trueFalseAmount = Number(settings.trueFalseAmount);
        let multipleChoiceAmount = Number(settings.multipleChoiceAmount);
        let writtenAmount = Number(settings.writtenAmount);
        for (let i = 0; i < Math.max(trueFalseAmount, multipleChoiceAmount, writtenAmount); i++) {
            if (trueFalseAmount > 0) {
                const shuffledFlashcards = [...flashcardSet.flashCards].sort(() => Math.random() - 0.5);
                for (const flashcard of shuffledFlashcards) {
                    questions.push({
                        order: questions.length,
                        flashcard: flashcard._id,
                        questionType: 'trueFalse'
                    });
                }
                trueFalseAmount--;
            }
            if (multipleChoiceAmount > 0) {
                const shuffledFlashcards = [...flashcardSet.flashCards].sort(() => Math.random() - 0.5);
                for (const flashcard of shuffledFlashcards) {
                    questions.push({
                        order: questions.length,
                        flashcard: flashcard._id,
                        questionType: 'multipleChoice'
                    })
                }
                multipleChoiceAmount--;
            }
            if (writtenAmount > 0) {
                const shuffledFlashcards = [...flashcardSet.flashCards].sort(() => Math.random() - 0.5);
                for (const flashcard of shuffledFlashcards) {
                    questions.push({
                        order: questions.length,
                        flashcard: flashcard._id,
                        questionType: 'written'
                    })
                }
                writtenAmount--;
            }
        }
        const learnSettings = new Learn({
            flashcardSet: flashcardSetId,
            user: req.user._id,
            settings: settings,
            questions: questions
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
            return res.status(200).json({ learnSessionId: null, message: 'No learn session found for this flashcard set' });
        }
        if (new Date(learnSession.createdAt).getTime() < new Date(flashcardSet.lastEdited).getTime()) {
            await Learn.findByIdAndDelete(learnSession._id);
            return res.status(200).json({ learnSessionId: null, message: 'Learn session is outdated, please create a new one' });
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

export const generateLearnSession = async (req, res) => {
    const { id } = req.params;
    console.log('Generating learn session for ID:', id);
    try {
        const learnSession = await Learn.findById(id).populate('flashcardSet').populate('user', ['username', '_id']);
        if (!learnSession) {
            return res.status(404).json({ message: 'Learn session not found' });
        }
        const settings = learnSession.settings;
        const questions = [...learnSession.questions].sort((a, b) => a.order - b.order);
        const populatedQuestions = questions.splice(0, settings.amountPerSession).map(question => question.flashcard = learnSession.flashcardSet.flashCards.find(flashcard => flashcard._id.toString() === question.flashcard.toString()));
        res.status(200).json({
            questions: populatedQuestions
        })
    } catch (error) {
        console.error('Error generating learn session:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const checkAnswer = async (req, res) => {
    const { id, order } = req.params;
    const { answer } = req.query;
    try {
        const learnSession = await Learn.findById(id);
        if (!learnSession) {
            return res.status(404).json({ message: 'Learn session not found' });
        }
        if (learnSession.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to check this answer' });
        }
        const question = learnSession.questions.find(question => question.order.toString() === order);
        if (!question) {
            return res.status(404).json({ message: 'Question not found in learn session' });
        }
        const flashcard = await question.flashcard.populate('flashcard', ['question', 'answer']);
        if (!flashcard) {
            return res.status(404).json({ message: 'Flashcard not found' });
        }
        const isCorrect = flashcard.answer.toLowerCase() === answer.toLowerCase();
        if (isCorrect) {
            learnSession.questions.findByIdAndDelete(question._id);
            await learnSession.save();
            return res.status(200).json({ isCorrect: true });
        }
        res.status(200).json({ isCorrect: false, correctAnswer: flashcard.answer });
    } catch (error) {
        console.error('Error checking answer:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}