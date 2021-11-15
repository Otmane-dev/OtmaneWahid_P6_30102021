const mongoose = require('mongoose');


const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, require: true },
    description: { type: String, required: true },
    mainPepper: { type: String, require: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, require: true, default: 0 },
    dislikes: { type: Number, require: true, default: 0 },
    usersLiked: { type: [String], require: true },
    usersDisliked: { type: [String], require: true }

})

module.exports = mongoose.model('Sauces', sauceSchema);