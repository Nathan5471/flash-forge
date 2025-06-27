import mongoose, { trusted } from 'mongoose';

const leaderBoardSchema = new mongoose.Schema({
    flashcardSet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FlashcardSet',
        required: true,
        unique: true
    },
    leaderBoard: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        time: {
            type: Number,
            required: true,
            min: 0
        },
        date: {
            type: Date,
            default: Date.now,
            required: true
        },
        rank: {
            type: Number,
            default: 0,
            required: true
        }
    }]
})

const LeaderBoard = mongoose.model('LeaderBoard', leaderBoardSchema);
export default LeaderBoard;