var blog = require("../db/models/blog");
var Comment = require("../db/models/comment");

var middlewareObj = {};

//Check ownership for comment
middlewareObj.isCommentAuthorised = function (req, res, next) {
    if(req.isAuthenticated()){
           Comment.findById(req.params.comment_id, function(err, foundComment){
              if(err){
                  req.flash("error", err)
                  res.redirect("back");
              }  else {
                  // does user own the comment?
               if(foundComment.name.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You shouldn't be here")
                   res.send("No be your comment");
               }
              }
           });
       } else {
           req.flash("error", "please log in")
           res.redirect("/login");
       }
   }

//Check ownership for blogpost
middlewareObj.isAuthorised = function  (req, res, next) {
    if(req.isAuthenticated()){
           blog.findById(req.params.id, function(err, foundBlog){
              if(err){
                  req.flash("error", "please log in")
                  res.redirect("back");
              }  else {
                var author={
                    id: req.user._id,
                    username: req.user.username
                }
                  //does user own the blog?
               if(req.user._id.equals(foundBlog.author.id)) {
                   next();
               } else {
                   req.flash("error", "You shouldn't be here")
                   res.redirect("back");
               }
              }
           });
       } else {
           res.redirect("/login");
       }
   }

//Check for Login
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "please log in")
    res.redirect("/login");
}

module.exports = middlewareObj;
