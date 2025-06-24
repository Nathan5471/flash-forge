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
        amountPerSession: {
            type: Number,
            required: true,
            min: 1
        },
        trueFalseAmount: {
            type: Number,
            required: true,
            min: 0
        },
        multipleChoiceAmount: {
            type: Number,
            required: true,
            min: 0
        },
        writtenAmount: {
            type: Number,
            required: true,
            min: 0
        }
    },
    questions: [{
        order: {
            type: Number,
            required: true
        },
        flashcard: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Flashcard',
            required: true
        },
        questionType: {
            type: String,
            enum: ['trueFlase', 'multipleChoice', 'written'],
            required: true
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Learn = mongoose.model('Learn', learnSchema);