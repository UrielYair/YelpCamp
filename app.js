const   PORT            = process.env.PORT || 3000,
        DATABASEURL     = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
        express         = require("express"),
        app             = express(),
        bodyParser      = require("body-parser"),
        mongoose        = require("mongoose"),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        Campground      = require("./models/campground"),
        Comment         = require("./models/comment"),
        User            = require('./models/user'), 
        seedDB          = require("./seeds");

// requiring routes:
const   indexRoutes     = require('./routes/index'),
        campgroundRoute = require('./routes/campgrounds'),
        commentRoutes   = require('./routes/comments');
        

mongoose.connect(DATABASEURL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// Passport configuration:
app.use(require('express-session')({
    secret: "learning is great", // TODO: export to env variable.
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(PORT, function(){
    console.log("The YelpCamp Server has Started.");
});

