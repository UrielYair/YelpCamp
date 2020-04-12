var PORT        = process.env.PORT || 5000,
    express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name:"Salmon Creek", 
//         image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
//         description: "Nice place with amazing view."
//     }, function(err, campground){
//         if (err){
//             console.log(err);
//         }
//         else{
//             console.log("Newly Created Campground.");
//             console.log(campground);
//         }
//     });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// {name:"Salmon Creek", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
// {name:"Granite Hill", image:"https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
// {name:"Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"},
// {name:"Salmon Creek", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
// {name:"Granite Hill", image:"https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
// {name:"Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"},
// {name:"Salmon Creek", image:"https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
// {name:"Granite Hill", image:"https://images.unsplash.com/photo-1532339142463-fd0a8979791a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
// {name:"Mountain Goat's Rest", image:"https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80"}



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
    var newCamp = {name: req.body.name, image: req.body.image, description: req.body.description};
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

