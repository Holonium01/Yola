const express                 = require("express"),
    bodyParser              = require("body-parser"),
    methodOverride          = require("method-override"),
    expressSanitizer        = require("express-sanitizer"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local").Strategy,
    flash                   = require("connect-flash"),
    passportLocalMongoose   = require("passport-local-mongoose")
    User                    = require("./db/models/user"),
    expressSession          = require("express-session"),
    cookieParser            = require("cookie-parser"),
    app                     = express(),
    multer                  = require('multer'),
    cloudinary              = require('cloudinary').v2,
    prod                    = require("./db/models/production")(app);
    

    require('dotenv').config();

//requring routes
const commentRoutes    = require("./routes/comment"),
    blogRoutes = require("./routes/blog"),
    indexRoutes      = require("./routes/index"),
    mongoose = require('./db/mongoose');

//setting up file storage
// const fileStorage = multer.diskStorage({
//     destination:(req, file, cb) => {
//         cb(null, 'image')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.filename + '-' + file.originalname)
//     }
// });
// const fileFilter = (req, file, cb) => {
//     if (
//       file.mimetype === 'image/png' ||
//       file.mimetype === 'image/jpg' ||
//       file.mimetype === 'image/jpeg'
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//     }
//   };
//App config  
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use('/image',express.static(__dirname + '/image'));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
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
app.use((req, res, next) =>{
    res.status(404).send('Page not found');
});

// Cloudinary setup
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
}); 

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
// process.env.PORT ||
let PORT =  3000;
app.listen(PORT, () => {
    console.log(process.env.WELCOME_MESSAGE)
});