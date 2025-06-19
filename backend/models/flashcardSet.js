import mongoose from 'mongoose';

const flashcardSetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    flashCards: [{
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        }
    }],
    lastEdited: {
        type: Date,
        default: Date.now,
    }
})

const FlashcardSet = mongoose.model('FlashcardSet', flashcardSetSchema);
export default FlashcardSet;