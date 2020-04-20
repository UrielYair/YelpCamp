const   mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        Comment     = require("./models/comment");

var seeds = [
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

async function seedDB(){
    try{
        await Campground.deleteMany({});
        console.log("Campground removed.");
        await Comment.deleteMany({});
        console.log("Comment removed.");
        for(const seed of seeds){
            let campground = await Campground.create(seed);
            console.log("Campground created.");
            let comment = await Comment.create({
                    text: "Bring food with you! :)",
                    author: "John Doe"
            });
            console.log("Comment created.");
            campground.comments.push(comment);
            campground.save();
            console.log("Comment added to campground.");
        }
    }
    catch(err){
        console.log(err);
    }
}

module.exports = seedDB;