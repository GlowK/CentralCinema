// ============================
// AUTH ROUTES
// ============================
// ============================
// Basic setup - inicial
// ============================
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
// ============================
// ROUTES
// ============================
// ============================
// ROOT ROUTE
// ============================
router.get("/", (req, res) =>{
    res.render("landing");
})

//AUTH ROUTES - more information about the movie

// ============================
// REGISTER FORM ROUTE
// ============================
router.get("/register", (req, res) => {
    res.render("register", {page: "register"});
});

// ============================
// REGISTER FORM LOGIC 
// ============================
router.post("/register", (req, res) => {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,  (err, user) => {
        if(err){
            req.flash("error", {error: err.message});
            // Wazne zeby bylo redirect przy bledzie nie render. render nie sporwoduje
            // ze wyswietli sie alert
            return res.redirect("register");
        }
            passport.authenticate("local")(req, res, () =>{
                req.flash("success", "Welcome " + req.body.username);
                res.redirect("/movies")
        });
    });
});

// ============================
// LOGIN FORM ROUTE
// ============================
router.get("/login", (req, res) => {
    res.render("login", {page: "login"});
});

// ============================
// LOGIN FORM LOGIC
// app.post("/page", middleware, callback)
// ============================

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/movies",
        failureRedirect: "/login"
    }),
        (req, res) => {
    
});

// ============================
// LOGUT ROUTE
// ============================
router.get("/logout", (req, res) =>{
    req.logout();
    req.flash("success", "You have log out sucessfuly.")
    res.redirect("/movies");
})

// ============================
// Basic setup - export
// ============================
module.exports = router;