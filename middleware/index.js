const Restaurant = require('../models/Restaurant'),
      Comment    = require('../models/Comment');

const middleware = {};

middleware.checkRestaurantOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Restaurant.findById(req.params.id, (err, foundRestaurant) => {
            if(err || !foundRestaurant) {
                req.flash('error', 'Restaurant not found');
                res.redirect('back');
            } else {
                // Does user own Restaurant?
                if(foundRestaurant.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Unauthorized Request');
                    res.redirect('back');
                }
            }
        });
    } else {
       res.redirect('back');    
    }
}

middleware.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err || !foundComment) {
                req.flash('error', 'Comment not found');
                res.redirect('back');
            } else {
                // Does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Unauthorized request');
                    res.redirect('back');
                }
            }
        });
    } else {
       req.flash('error', 'You Must First Login!'); 
       res.redirect('back');    
    }
}

middleware.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please Login In')
    res.redirect('/login');
}

module.exports = middleware;