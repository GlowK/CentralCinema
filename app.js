const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const moment = require("moment");
var assert = require('assert');  
const mongodb = require ("./mongodb/mongodb.connect");

// ============================
// ? 
// ============================
app.use(express.json());

// ============================
// One line required for Moment to be operable in EJS files
// ============================
app.locals.moment = moment;

// ============================
// Requring routes 
// ============================
var commentRoutes       = require("./routes/comments");
var reviewRoutes        = require("./routes/reviews");
var moviesRoutes        = require("./routes/movies");
var authRoutes          = require("./routes/auth");
var showingRoutes       = require("./routes/showings");
var superUsers          = require("./routes/superusers");

// ============================
// Initial setups 
// ============================
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //Static links 
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// mongoose.connect('mongodb://username:password@host:port/database')
// mongoose.connect("mongodb://localhost:27017/CentralCinema",{useNewUrlParser: true});
// // mongoose.connect("mongodb://cinema:cinema2019@5.9.105.246:27017/CentralCinema",{useNewUrlParser: true});
// mongoose.connection.on('error', err => {
//     throw 'failed connect to MongoDB';
//   });
mongodb.connect();
mongoose.set('useFindAndModify', false); //potrzbne od uzycia findByIdAndUpdate (depricated)
app.use(flash());


// ============================
// Models
// ============================
// var Movie = require("./models/movie");
// var Comment = require("./models/comment");
var User = require("./models/user");

// ============================
// Passport configuration
// ============================
app.use(require("express-session")({
    secret: "To jest nasze haslo szyfrujace",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ============================
// Passing currentUser check to every route 
// Passing flash messages to every single page template
// ============================
app.use((req, res, next)=>{ 
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ============================
// Routes for Express router
// ============================
app.use("/", authRoutes);
app.use("/movies/:id/comments", commentRoutes);
app.use("/movies/:id/reviews", reviewRoutes);
app.use("/movies", moviesRoutes);
app.use("/movies/:id/showing", showingRoutes);


// ============================
// Elementy dodane na potrzeby testow 
// ============================
app.use("/superusers", superUsers);

// ============================
// Listen init
// ============================
/* app.listen(3000, () =>{
    console.log("##################################");
    console.log("CentralCinema Sever is running....");
    console.log("##################################");
})
 */
// ============================
// Elementy dodane na potrzeby testow 2 
// ============================
module.exports = app;