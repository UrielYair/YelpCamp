const   mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment");

var data = [
    {
        name:"Akhziv campsite",
        image: "https://static.parks.org.il/wp-content/uploads/2018/06/GRP5505-e1534064757241.jpg",
        description: "A Mediterranean experience: camping within touching distance of picturesque bays"
    },
    {
        name:"Amud Stream Campsite",
        image: "https://static.parks.org.il/wp-content/uploads/2018/02/MG_9415-e1518117758874.jpg",
        description: "Connect with nature to connect with yourself: camping right in the heart of the Galilee"
    },
    {
        name:"Campsite Masada West",
        image: "https://static.parks.org.il/wp-content/uploads/2018/02/20171112_114031-e1518125464719.jpg",
        description: "On the way up: spend the night in a well-equipped camping area, and in the morning, climb up to watch the sunrise. A once-in-a-lifetime experience!"
    }
];

function seedDB(){
    // remove all campgrounds
    Campground.remove({},err=>{
        if (err){
            console.log(err);
        }
        console.log("Campgrounds removed!");
        // add a few campgrounds
        data.forEach(camp =>{
            Campground.create(camp,(err,campground)=>{
                if (err){
                    console.log(err);
                }
                else {
                    console.log("added a campground.");

                    //create a comment
                    Comment.create(
                        {
                            text: "This place are great, But I wish there was internet",
                            author: "Uriel"
                        }
                        ,(err, comment)=>{
                            if (err){
                                console.log(err);
                            }
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log("created new comment.");
                            }
                    });
                }
            });
        });
    });
}

module.exports = seedDB;