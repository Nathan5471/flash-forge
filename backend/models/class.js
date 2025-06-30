import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    className: {
        type: String,
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    joinCode: {
        type: String,
        required: true,
        unique: true
    },
    assignedFlashcards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlashcardSet',
        default: []
    }]
})

const Class = mongoose.model('Class', classSchema);
export default Class