const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NoteSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Note', NoteSchema);