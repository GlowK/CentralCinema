// ============================
// COMMENTS ROUTES
// ============================
// ============================
// Basic setup - inicial
// ============================
var express = require("express");
var router = express.Router({mergeParams: true}); // {mergeParams: true} for req.params.id to work
var Movie = require("../models/movie");
var Comment = require("../models/comment");
var middleware = require("../middleware");
// ============================
// ROUTES
// ============================

// ============================
// COMMENTS - NEW
// ============================
router.get("/new", middleware.isLoggedIn, (req, res) =>{
    //console.log(req.params.id);
    Movie.findById(req.params.id, (err, movie) =>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {movie: movie})
        }
    })
});

// ============================
// COMMENTS - CREATE
// ============================
router.post("/", middleware.isLoggedIn, (req, res) => {
    Movie.findById(req.params.id, (err, foundMovie) =>{
        if(err){
            console.log(err);
            res.redirect("/movies");
        }else{
            Comment.create(req.body.comment, (err, newComment) =>{
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    //add username and id to comment
                    //console.log(req.user.username);
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    //save newComment
                    newComment.save();
                    foundMovie.comments.push(newComment);
                    foundMovie.save();
                    //console.log(newComment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/movies/" + foundMovie._id);
                }
            });
        }
    });
});

// ============================
// COMMENTS - EDIT
// ============================
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
    Movie.findById(req.params.id, (err, foundMovie) => {
        if(err){
            res.redirect("back");
        }else{
            Comment.findById(req.params.comment_id, (err, foundComment) => {
                if(err){
                    res.redirect("back");
                }else{
                    res.render("comments/edit", {movie: foundMovie, comment: foundComment});
                }
            })   
        }
    });
});

// ============================
// COMMENTS - UPDATE
// ============================
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) =>{
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/movies/" + req.params.id);
        }
    })
});

// ============================
// COMMENTS - DESTROY
// ============================
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) =>{
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment deleted");
            res.redirect("/movies/" + req.params.id);
        }
    })
});

// ============================
// Basic setup - export
// ============================
module.exports = router;

