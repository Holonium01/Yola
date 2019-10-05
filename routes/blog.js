var express = require("express");
var router  = express.Router();
var blog    = require("../db/models/blog");
var middleware = require("../middleware")



//Index Route
router.get("/", function(req, res){
    blog.find({}, function(err, blogs){
        if(err){
            console.log(err)
        }else{
            res.render("blog/index", {blogs:blogs});
        }
    });
});

//New
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("blog/new")
});

//Create Route
router.post("/", middleware.isLoggedIn, function(req, res){
    req.body.content = req.sanitize(req.body.content)
    var title = req.body.title;
    var image = req.body.image;
    var content = req.body.content;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    var newBlogpost = { content:content, author:author, image:image, title:title}
    blog.create(newBlogpost, function(err, newBlog){
        if(err){
            res.render("blog/new")
        } else{
            //redirect to index
            res.redirect("/blog");
        }
    });
})

//Show Route
router.get("/:id", function(req, res){
    blog.findById(req.params.id).populate("comment").exec(function(err, currentBlog){
        if(err){
            res.redirect("/blog")
        }else{
            res.render("blog/show", {blog:currentBlog})
        }
    })
})
//Edit Route
router.get("/:id/edit", middleware.isAuthorised, function(req, res){
    blog.findById(req.params.id, function(err, foundBlog){
        res.render("blog/edit", {blog:foundBlog})
    })
})
//Update Route
router.put("/:id", middleware.isAuthorised, function(req,  res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blog")
        }else{
            res.redirect("/blog/" + req.params.id );
        }
    })
})

//Delete route
router.delete("/:id", middleware.isAuthorised, function( req, res){
    blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/blog")
        }else{
            res.redirect("/blog")
        }
    })
})



module.exports = router;