var express  = require("express");
var router   = express.Router({mergeParams:true});
var Comment      = require("../db/models/comment");
var blog         = require("../db/models/blog");
var middleware = require("../middleware")




// ====================
//   COMMENT ROUTE
// ====================

router.get("/new", middleware.isLoggedIn, function(req, res){
    blog.findById(req.params.id, function(err, blog){
        if (err){
            console.log(err)
        }else{
             res.render("comment/new", {blog:blog});
        }
    })
 })
 
 router.post("/", middleware.isLoggedIn, function(req, res){
     blog.findById(req.params.id, function(err, blog){
         if(err){
             console.log(err)
             res.redirect("/blog")
         }else{
             Comment.create(req.body.comment, function(err, comment){
                 if(err){
                     console.log(err)
                 }else{
                     comment.name.id = req.user._id;
                     comment.name.username = req.user.username;
                     comment.save();
                     blog.comment.push(comment);
                     blog.save();
                     res.redirect("/blog/" + blog._id);
                 }
             })
         }
     })
 })
 //Edit Comment
router.get("/:comment_id/edit", middleware.isCommentAuthorised, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back")
        }else{
            res.render("comment/edit", {blog_id: req.params.id, comment:foundComment})
        }
    });
});
//Update Comment
router.put("/:comment_id", middleware.isCommentAuthorised, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
         if(err){
             res.redirect("back")
         }else{
             res.redirect("/blog/" + req.params.id)
         }
    });
});
//delete Comment
router.delete("/:comment_id", middleware.isCommentAuthorised, function(req, res){
    Comment.findByIdAndDelete(req.params.comment_id, function(err, deletedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/blog/" + req.params.id)
        }
    })
})

   
 module.exports = router;