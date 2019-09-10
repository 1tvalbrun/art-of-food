const express    = require('express');
const router     = express.Router({mergeParams: true});
const Restaurant = require('../models/Restaurant');
const Comment    = require('../models/Comment');
const middleware = require('../middleware/index');

// Comments New
router.get('/new', middleware.isLoggedIn, (req, res) => {
    // Find Restaurant by id
    Restaurant.findById(req.params.id, (err, restaurant) => {
        err ? console.log(err) : res.render('comments/new', {restaurant: restaurant});
    })
});

// Comments Create
router.post('/', middleware.isLoggedIn, (req, res) => {
    // Look up restaurant by ID
    Restaurant.findById(req.params.id, (err, restaurant) => {
        err ? console.log(err) : Comment.create(req.body.comment, (err, comment) => {
            err ? console.log(err) : 
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // Save comment
            comment.save();
            restaurant.comments.push(comment);
            restaurant.save();
            req.flash('success', 'Successfully Added Comment!');
            res.redirect(`/restaurants/${restaurant._id}`);
        })
    })
});

// Comments Edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Restaurant.findById(req.params.id, (err, foundRestaurant) => {
        if(err || !foundRestaurant) {
            req.flash('error', 'No restaurant found');
            return res.redirect('back');
        }
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect('back');
            } else {
                res.render('comments/edit', {restaurant_id: req.params.id, comment: foundComment});
            }
        });
    });
});

// Comments Update
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        err ? res.redirect('back') : res.redirect(`/restaurants/${req.params.id}`);
    });
});

// Comment Destroy
router.delete('/:comment_id', (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        err ? res.redirect('back') : req.flash('success', 'Comment Deleted'); res.redirect(`/restaurants/${req.params.id}`);
    })
});

module.exports = router;