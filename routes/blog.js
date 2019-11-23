var express = require("express");
var cloudinary = require('cloudinary').v2;
var router  = express.Router();
var blog    = require("../db/models/blog");
var middleware = require("../middleware");
const{parser} = require('../config/cloudinary');

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
router.post("/", middleware.isLoggedIn, parser.single('image'), function(req, res){
    req.body.content = req.sanitize(req.body.content)
    var title = req.body.title;
    // let images = req.file;
    let image;
    var content = req.body.content;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    // const image = images.path;
cloudinary.uploader.upload(req.file.url, (err, response) =>{
    if(err){
        console.log(err)
        res.redirect('back')
    } else {
         let image = req.file.url;
        var newBlogpost = { content:content, author:author, image:image, title:title}
        console.log(req.file)
        blog.create(newBlogpost, function(err, newBlog){
        
        if(err){
            res.render("blog/new")
            console.log(err)
        } else{
            //redirect to index
            console.log(image)
            res.redirect('/blog')
        }
    });
    }
})    
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
// router.get("/:id/edit", middleware.isAuthorised, function(req, res){
//     blog.findById(req.params.id, function(err, foundBlog){
//         res.render("blog/edit", {blog:foundBlog})
//     })
// })
//Update Route
// router.put("/:id", middleware.isAuthorised, function(req,  res){
//     console.log(req.body)
//     req.body.blog.content = req.sanitize(req.body.blog.content)
//     blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
//         if(err){
//             res.redirect("/blog")
//         }else{
//             res.redirect("/blog/" );
//         }
//     })
// })

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