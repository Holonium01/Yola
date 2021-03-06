const express   = require("express");
const router    = express.Router();
const passport      = require("passport");
const User          = require("../db/models/user");
const LocalStrategy   = require("passport-local").Strategy;
const nodemailer     = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: ''
    }
}));

router.get("/", function(req, res){
    res.redirect("/blog");
})


//======================
//  Auth Route
//======================

// show register form
router.get("/register", function(req, res){
    res.render("register"); 
 });
 //handle sign up logic
 router.post("/register",function(req, res){
     const newUser = new User({username: req.body.username});
     User.register(newUser, req.body.password, function(err, user){
         if(err){ req.flash("success" , err.message);
            return res.render("register");
         }
         passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome "  + user.username + ", we are happy to have you join this movement");
            res.redirect("/blog"); 
         });
     });
 });
 //===============================================
 // show login form
 router.get("/login", function(req, res){
    res.render("login"); 
 });

// show about form
  router.get("/about", function(req, res){
    res.render("about"); 
 });
 //handling login logic
 router.post("/login", passport.authenticate("local", 
     {
         successRedirect: "/blog",
         failureRedirect: "/login",
         failureFlash: true,
         successFlash : "Welcome back",
     }), function(req, res){
 });
 
 // logout route
 router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "succesfully logged out")
    res.redirect("/blog");
 });
 

 module.exports = router;