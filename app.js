var PORT        = process.env.PORT || 5000,
    express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");



mongoose.connect("mongodb://localhost/yelp_camp", 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();


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
            res.render("index", {campgrounds: allCampgrounds});
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
    res.render("newCamp");
});

// Show - show more info about specific campground.
app.get("/campgrounds/:id",function(req, res){
    
    Campground.findById(req.params.id).populate("comments").exec(function(err, requestedCampground){
        if(err){
            console.log(err);
        }
        else{
            // console.log(requestedCampground);
            res.render("show", {campground: requestedCampground});
        }
    });
});

app.listen(PORT, function(){
    console.log("The YelpCamp Server has Started.");
});

