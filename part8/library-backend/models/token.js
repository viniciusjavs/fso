const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    token: {
        type: String,
        require: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true
    }
})

module.exports = mongoose.model('Token', schema)