const mongoose = require('mongoose');

const BookSchema = mongoose.Schema({
    bookName: {
        type: String,
        required: true,
        min: 4
    },
    author: {
        type: String,
        required: true,
        min: 4
    },
    genre: {
        type: String,
        default: 'Novel/Romantic Drama',
        min: 3
    },
    releaseDate: {
        type: Date,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: true,
    },
    bookImage: {
        type: String,
        required: true,
        min: 10
    }
})

module.exports = mongoose.model('books',BookSchema)