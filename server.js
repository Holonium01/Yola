const express                 = require("express"),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"),
    methodOverride          = require("method-override"),
    expressSanitizer        = require("express-sanitizer"),
    seedDB                  = require("./seed"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local").Strategy,
    flash                   = require("connect-flash"),
    passportLocalMongoose   = require("passport-local-mongoose")
    User                    = require("./db/models/user"),
    expressSession          = require("express-session"),
    cookieParser            = require("cookie-parser"),
    app                     = express(),

    require('dotenv').config()

//requring routes
const commentRoutes    = require("./routes/comment"),
    blogRoutes = require("./routes/blog"),
    indexRoutes      = require("./routes/index"),
    { mongoose } = require('./db/mongoose'),
    prod     =      require(".db/models/prod")(app);

//App config  
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());
app.use(cookieParser('secret'));

//Passport Config
app.use(expressSession({
    secret: "Holonium shit",
    resave: false,
    saveUninitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success      = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/blog", blogRoutes);
app.use("/blog/:id/comment", commentRoutes);

// Clean up server when process exits
process.on('exit', (code) => {
    mongoose.disconnect();
    console.log('PROCESS IS EXITING WITH CODE ' + code);
});

// Handle server clean up in the event  of CTRL-C exit
process.on('SIGINT', (code) => {
    console.log('Ctrl-C was hit by server admin. EXITING WITH CODE ' + code);
    mongoose.disconnect();
    process.exit(2)
});

// Handle server clean up for uncaught errors
process.on('uncaughtException', (err) => {
    console.log(err.stack);
    mongoose.disconnect();
    process.exit(99)
})

let PORT = app.get(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log("Gist server running")
});
