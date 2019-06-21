// ============================
// MOVIES ROUTES
// ============================
// ============================
// Basic setup - inicial
// ============================
var express = require("express");
var router = express.Router();
var Movie = require("../models/movie");
var middleware = require("../middleware");
// ============================
// ROUTES
// ============================

// ============================
// INDEX - show all movies
// ============================
router.get("/", (req, res) =>{
    // Get movies from DB
    // console.log(req.user); 
    if(req.query.search){
        var endDateSearch = req.query.search;
        Movie.find({endDate: {$gte:endDateSearch}}, (err, allMovies) =>{
            if(err){
                console.log(err);
            }else{
                // Render the movies
                res.render("movies/index", {movies: allMovies, page: "movies"});
            }
        });
    }else{
        Movie.find({}, (err, allMovies) =>{
            if(err){
                console.log(err);
            }else{
                // Render the movies
                res.render("movies/index", {movies: allMovies, page: "movies"});
            }
        }); 
    }
});

// ============================
// INDEX - add new movie to db
// ============================
router.post("/", middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var trailer = req.body.trailer;
    var desc = req.body.description;
    var endDate = req.body.endDate;
    var startDate = req.body.startDate;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newMovie = {name: name, image: image, trailer: trailer, description: desc, author:author, startDate:startDate, endDate:endDate};
    //movies.push(newMovie);
    //console.log(req.user)
    Movie.create(newMovie, (err, newlyCreatedMovie) =>{
        if(err){
            console.log(err);
        }else{
            // Redirect to Movies
            // console.log(newlyCreatedMovie)
            res.redirect("/movies");
        }
    });
});

// ============================
// NEW - show form to create new movie
// ============================
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("movies/new")
});

// ============================
// SHOW - more information about the movie
// ============================
router.get("/:id", (req,res) => {
    Movie.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options:{sort: {createdAt: -1}}
    }).exec((err, foundMovie) =>{
        if(err){
            console.log(err);
        }else{
            //console.log(foundMovie);
            res.render("movies/show", {movie: foundMovie});
        }
    } )
});

// ============================
// TRAILER - See trailer of the movie
// ============================
router.get("/:id/trailer", (req, res) => {
    Movie.findById(req.params.id, (err, foundMovie) =>{
        if(err){
            console.log(err);
        }else{
            res.render("movies/trailer", {movie: foundMovie});  
        }
    });    
});

// ============================
// EDIT
// ============================
router.get("/:id/edit", middleware.checkMovieOwnership, (req, res) => {
    Movie.findById(req.params.id, (err, foundMovie) =>{
        if(err){
            console.log(err);
        }else{
            res.render("movies/edit", {movie: foundMovie});  
        }
    });    
});

// ============================
// UPDATE
// ============================
router.put("/:id", middleware.checkMovieOwnership, (req, res) =>{
    Movie.findByIdAndUpdate(req.params.id, req.body.movie , (err, updatedMovie) =>{
        if(err){
            res.redirect("/movies")
        }else{
            //redirect to the just edited page
            res.redirect("/movies/" + req.params.id);
        }
    })
});

// ============================
// DESTROY
// ============================
router.delete("/:id", middleware.checkMovieOwnership, (req, res) =>{
    Movie.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/movies")
        }else{
            res.redirect("/movies")
        }
    })
});

// ============================
// Basic setup - export
// ============================
module.exports = router;


