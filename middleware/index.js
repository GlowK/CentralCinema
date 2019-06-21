var Movie = require("../models/movie");
var Comment = require("../models/comment");
var Review = require("../models/review");

var middlewareObj = {};

// ============================
// Sprawdzenie kto stworzyl dany film
// i czy ma prawa do edycji
// ============================
middlewareObj.checkMovieOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Movie.findById(req.params.id, (err, foundMovie) =>{
            if(err){
                req.flash("error", "Movie not found.");
                res.redirect("back");
            }else{
                //Sprawdzamy czy autor jest taki sam jak zalogowany user lub admin
                if(foundMovie.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error", "You dont have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    } 
}

// ============================
// Sprawdzenie kto stworzyl dany koementarz
// ============================
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) =>{
            if(err){
                res.redirect("back");
            }else{
                //Sprawdzamy czy autor jest taki sam jak zalogowany user lub admin
                if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error", "You dont have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    } 
}

middlewareObj.checkReviewOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, function(err, foundReview){
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = function (req, res, next) {
    if (req.isAuthenticated()) {
        Movie.findById(req.params.id).populate("reviews").exec(function (err, foundMovie) {
            if (err || !foundMovie) {
                req.flash("error", "Movie not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundMovie.reviews
                var foundUserReview = foundMovie.reviews.some(function (review) {
                    return review.author.id.equals(req.user._id);
                });
                if (foundUserReview) {
                    req.flash("error", "You already wrote a review.");
                    return res.redirect("/movies/" + foundMovie._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("/login");
    }
}

// ============================
// Basic setup - export
// ============================
module.exports = middlewareObj;