const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RestaurantSchema = new Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"

        }
    ]
});

module.exports = Restaurant = mongoose.model('Restaurant', RestaurantSchema);