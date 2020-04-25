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

// Routes:
app.get("/", function(req, res){
    res.render("landing page");
});

// Index - show all campgrounds
app.get("/campgrounds", function(req, res){
    
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
    
});

// Create - add new campground to DB.
app.post("/campgrounds", function(req, res){
    var newCamp = {
        name: req.body.name, 
        image: req.body.image, 
        description: req.body.description
    };
    Campground.create(newCamp, function(err, newlyCreatedCamp){
        if (err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

// New - show form to create new campground.
app.get("/campgrounds/new",function(req, res){
    res.render("campgrounds/newCamp");
});

// Show - show more info about specific campground.
app.get("/campgrounds/:id",function(req, res){    
    Campground.findById(req.params.id).populate("comments").exec(function(err, requestedCampground){
        if(err){
            console.log(err);
        }
        else{
            // console.log(requestedCampground);
            res.render("campgrounds/show", {campground: requestedCampground});
        }
    });
});

// Comments Routes:
app.get("/campgrounds/:id/comments/new",(req, res)=>{
    //find campground by id.
    Campground.findById(req.params.id, (err, campground)=>{
        if (err){
            console.log(err);
        }
        else{
            res.render("comments/new", ({campground: campground}));
        }
    })
});

app.post("/campgrounds/:id/comments/",(req,res)=>{
    //lookout campground using ID
    Campground.findById(req.params.id,(err, campground)=>{
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            //create new comment
            Comment.create(req.body.comment,(err,comment)=>{
                if (err){
                    console.log(err);
                }
                //connect new comment to campground
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/" + campground._id);
            });
        }
    });    
});

app.listen(PORT, function(){
    console.log("The YelpCamp Server has Started.");
});

