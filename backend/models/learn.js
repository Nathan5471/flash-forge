import mongoose from 'mongoose';

const learnSchema = new mongoose.Schema({
    flashcardSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlashcardSet',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    settings: {
        type: Object,
        default: {}
    },
    progress: [{
        flashcard: {
            type: Object,
            required: true
        },
        status: {
            type: Object,
            default: {}
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Learn = mongoose.model('Learn', learnSchema);