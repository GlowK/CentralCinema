var express = require("express");
var router = express.Router({mergeParams: true});
var Movie = require("../models/movie");
var Review = require("../models/review");
var middleware = require("../middleware");
var assert = require('assert');

// ============================
//  Reviews- INDEX
// ============================
router.get("/", function (req, res) {
    Movie.findById(req.params.id).populate({
        path: "reviews",
        options: {sort: {createdAt: -1}} // sortowanie od najnowszego na poczatku
    }).exec(function (err, movie) {
        if (err || !movie) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/index", {movie: movie});
    });
});

// ============================
//  Reviews - NEW (tylko jedno review na usera jest dostepne)
// ===========================
router.get("/new", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    Movie.findById(req.params.id, function (err, movie) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        res.render("reviews/new", {movie: movie});

    });
});

// ============================
//  Reviews- CREATE
// ============================
router.post("/", middleware.isLoggedIn, middleware.checkReviewExistence, function (req, res) {
    //lookup movie using ID
    Movie.findById(req.params.id).populate("reviews").exec(function (err, movie) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Review.create(req.body.review, function (err, review) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            //add author username/id and associated movie to the review
            review.author.id = req.user._id;
            review.author.username = req.user.username;
            review.movie = movie;
            //save review
            review.save();
            movie.reviews.push(review);
            // calculate the new average review for the movie
            movie.rating = calculateAverage(movie.reviews);
            //save movie
            movie.save();
            req.flash("success", "Your review has been successfully added.");
            res.redirect('/movies/' + movie._id);
        });
    });
});

// ============================
//  Reviews - EDIT
// ============================
router.get("/:review_id/edit", middleware.checkReviewOwnership, function (req, res) {
    Movie.findById(req.params.id, function (err, foundMovie) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }else{
            Review.findById(req.params.review_id, (err, foundReview) => {
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("back");
                }else{
                    res.render("reviews/edit", {movie: foundMovie, review: foundReview});
                }
            })
        }
    });
});

// ============================
//  Reviews - UPDATE
// ============================
router.put("/:review_id", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, {new: true}, function (err, updatedReview) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Movie.findById(req.params.id).populate("reviews").exec(function (err, movie) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // recalculate movie average
            movie.rating = calculateAverage(movie.reviews);
            //save changes
            movie.save();
            req.flash("success", "Your review was successfully edited.");
            res.redirect('/movies/' + movie._id);
        });
    });
});

// ============================
//  Reviews - DELETE
// ============================
router.delete("/:review_id", middleware.checkReviewOwnership, function (req, res) {
    Review.findByIdAndRemove(req.params.review_id, function (err) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Movie.findByIdAndUpdate(req.params.id, {$pull: {reviews: req.params.review_id}}, {new: true}).populate("reviews").exec(function (err, movie) {
            if (err) {
                req.flash("error", err.message);
                return res.redirect("back");
            }
            // rekalkulacja raitngu dla filmu: 
            movie.rating = calculateAverage(movie.reviews);
            //zapisanie zmian
            movie.save();
            //powiadomienie uzytkownika o akcji
            req.flash("success", "Your review was deleted successfully.");
            res.redirect("/movies/" + req.params.id);
        });
    });
});

function calculateAverage(reviews) {
    if (reviews.length === 0) {
        return 0;
    }
    var sum = 0;
    reviews.forEach(function (element) {
        sum = calculateSum(element.rating,sum);
    });
    return sum / reviews.length;
}

function calculateSum (a, b) {  
    return b + a;  
  }

module.exports = router;