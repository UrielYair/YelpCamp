var PORT        = process.env.PORT || 5000,
    express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");


seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true
    }
);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Routes:
app.get("/", function(req, res){
    res.render("landing page");
});

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

app.get("/campgrounds/new",function(req, res){
    res.render("newCamp");
});

app.get("/campgrounds/:id",function(req, res){
    
    Campground.findById(req.params.id, function(err, requestedCampground){
        if(err){
            console.log(err);
        }
        else{
            res.render("show", {campground: requestedCampground});
        }
    });
});

app.listen(PORT, function(){
    console.log("The YelpCamp Server has Started.");
});

