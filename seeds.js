const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const Comment = require('./models/Comment');

const data = [
    {
        name: "Clouds Rest",
        image: "https://images.unsplash.com/photo-1556745750-68295fefafc5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Landing Eagles",
        image: "https://images.unsplash.com/photo-1556745750-68295fefafc5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name: "Lovers Den",
        image: "https://images.unsplash.com/photo-1556742205-e10c9486e506?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=60",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }

]

const seedDB = () => {
    // remove all restaurants
    Restaurant.remove({}, (err) => {
        err ? console.log(err) : console.log('removed restaurants');
        // add restaurants
    data.forEach(seed => {
        Restaurant.create(seed, (err, restaurant) => {
            err ? console.log(err) : console.log('added restaurant');
            Comment.create(
                {
                    text: "nice place",
                    author: "Thierry"
                }, (err, comment) => {
                    err ? console.log(err) : 
                    restaurant.comments.push(comment);
                    restaurant.save();
                    console.log('created comment');
                })
        });
    });
    });
}

module.exports = seedDB;