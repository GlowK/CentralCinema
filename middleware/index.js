var Movie = require("../models/movie");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkMovieOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Movie.findById(req.params.id, (err, foundMovie) =>{
            if(err){
                req.flash("error", "Movie not found.");
                res.redirect("back");
            }else{
                //does user own this movie?
                //Sprawdzamy czy autor jest taki sam jak zalogowany user
                if(foundMovie.author.id.equals(req.user._id)){
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

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) =>{
            if(err){
                res.redirect("back");
            }else{
                //does user own this movie?
                //Sprawdzamy czy autor jest taki sam jak zalogowany user
                if(foundComment.author.id.equals(req.user._id)){
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