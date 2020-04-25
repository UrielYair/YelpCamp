const   express     = require('express'),
        router      = express.Router(),
        Campground  = require('../models/campground');

// Index - show all campgrounds
router.get("/", function(req, res){
    
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
    
});

// New - show form to create new campground.
router.get("/new", isLoggedIn,function(req, res){
    res.render("campgrounds/newCamp");
});


// Create - add new campground to DB.
router.post("/", isLoggedIn,function(req, res){
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
            res.redirect("/");
        }
    });
});


// Show - show more info about specific campground.
router.get("/:id",function(req, res){    
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

// middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;