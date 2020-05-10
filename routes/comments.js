const   express     = require('express'),
        router      = express.Router({ mergeParams: true }),
        Campground  = require('../models/campground'),
        Comment     = require('../models/comment');

// Comments New:
router.get("/new", isLoggedIn, (req, res)=>{
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

// Comments Create:
router.post("/", isLoggedIn,(req,res)=>{
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
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                //connect new comment to campground
                campground.comments.push(comment);
                campground.save();
                res.redirect("/campgrounds/" + campground._id);
            });
        }
    });    
});

// Comments Edit:
router.get("/:comment_id/edit", (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if (err){
            res.redirect("back");
        }
        else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// Comment Update:
router.put("/:comment_id", (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err, updatedComment)=>{
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id );
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