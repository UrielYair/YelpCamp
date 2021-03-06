const   express     = require('express'),
        router      = express.Router(),
        Campground  = require('../models/campground'),
        middleware  = require('../middleware');
        
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
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/newCamp");
});


// Create - add new campground to DB.
router.post("/", middleware.isLoggedIn, function(req, res){
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    var newCamp = {
        name: req.body.name,
        price: req.body.price,
        image: req.body.image, 
        description: req.body.description,
        author: author
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


// Show - show more info about specific campground.
router.get("/:id", function(req, res){    
    Campground.findById(req.params.id).populate("comments").exec(function(err, requestedCampground){
        if(err || !requestedCampground){
            req.flash("error", "Campground not found.");
            res.redirect("/campgrounds");
        }
        else{
            // console.log(requestedCampground);
            res.render("campgrounds/show", {campground: requestedCampground});
        }
    });
});

// EDIT campground route:
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        res.render("campgrounds/edit", {campground: foundCampground});        
    });    
});

// UPDATE campground route:
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,(err, updatedCampground)=>{
        if (err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// DELETE campground route:
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        if (err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            campground.remove();
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;