const express    = require('express'),
      router     = express.Router(),
      Restaurant = require('../models/Restaurant'),
      Comment    = require('../models/Comment'),
      middleware = require('../middleware');

// INDEX - Show all restaurants
router.get('/', (req, res) => {
    // Get all restaurants from DB
    Restaurant.find({}, (err, allRestaurants) => {
        err ? console.log(err) : res.render('restaurants/index', {restaurants: allRestaurants});
    });
});

// CREATE - Add new restaurant to DB
router.post('/', middleware.isLoggedIn, (req, res) => {
    // Get data from form
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newRestaurant = {name: name, image: image, description: description, author: author}
    // Create new Restaurant and save to DB
    Restaurant.create(newRestaurant, (err, newlyCreated) => {
        err ? console.log(err) : res.redirect('/restaurants');
    });
});

// NEW - Show form to create new restaurant
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('restaurants/new');
});

// SHOW - Shows more info about one restaurant
router.get('/:id', (req, res) => {
    // Find restaurant by ID
    Restaurant.findById(req.params.id).populate('comments').exec( (err, foundRestaurant) => {
        if(err || !foundRestaurant) {
            req.flash('error', 'Restaurant not found');
            res.redirect('back');
        } else {
            res.render('restaurants/show', {restaurant: foundRestaurant});
        }
    });
    req.params.id
    // Render show template with Restaurant
});

// EDIT - Restaurant Route
router.get('/:id/edit', middleware.checkRestaurantOwnership, (req, res) => {
    Restaurant.findById(req.params.id, (err, foundRestaurant) => {
        res.render('restaurants/edit', {restaurant: foundRestaurant});
    });
});

// UPDATE - Restaurant Route
router.put('/:id', middleware.checkRestaurantOwnership, (req, res) => {
    // Find and update correct restaurant
    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, (err, updatedRestaurant) => {
        err ? res.redirect('/restaurant') : res.redirect(`/restaurants/${req.params.id}`);
    });
});

// DESTROY - Restaurant Route
router.delete('/:id', middleware.checkRestaurantOwnership, (req, res) => {
    Restaurant.findByIdAndRemove(req.params.id, (err, restaurantRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: restaurantRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            req.flash('success', 'Restaurant deleted');
            res.redirect("/restaurants");
        });
    })
});

module.exports = router;