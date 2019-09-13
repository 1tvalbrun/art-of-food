const express          = require('express'),
      app              = express(),
      mongoose         = require('mongoose'),
      bodyParser       = require('body-parser'),
      passport         = require('passport'),
      LocalStrategy    = require('passport-local'),
      Restaurant       = require('./models/Restaurant'),
      User             = require('./models/User'),
      Comment          = require('./models/Comment'),
      methodOverride   = require('method-override'),
      flash            = require('connect-flash');
                         require('dotenv/config');

const restaurantRoutes = require('./routes/restaurants'),
      commentRoutes    = require('./routes/comments'),
      indexRoutes      = require('./routes/index');

// Passport Configuration 
app.use(require('express-session')({
   secret: 'Right',
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use('/', indexRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/restaurants/:id/comments', commentRoutes);
app.set('view engine', 'ejs');

// Connect to Mongo
mongoose.connect(process.env.DB_connection, {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));