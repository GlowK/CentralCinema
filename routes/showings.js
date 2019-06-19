var express = require("express");
var router = express.Router({mergeParams: true});
var Movie = require("../models/movie");
var Showing = require("../models/showing");
var CinemaHall = require("../models/cinemaHall");
var middleware = require("../middleware");

// ============================
//  Showings - INDEX
// ============================
router.get("/", function (req, res) {
    Movie.findById(req.params.id).exec(function (err, movie) {
        if (err || !movie) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        Showing.findOne({movie: movie}).exec((err, foundShowing) => {
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }
            CinemaHall.findOne({name: "blue"}).exec((err, foundCinemaHall) =>{
                if(err){
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
                res.render("showings/index", {movie: movie, showing: foundShowing, cinemaHall: foundCinemaHall});
            })           
        });
    });
});

// ============================
//  Showings - NEW
// ===========================
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Movie.findById(req.params.id, function (err, movie) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        
        res.render("showings/new", {movie: movie});

    });
});

// ============================
//  Reviews- CREATE
// ============================
// przydal by sie middleware.checkSHOWINGExistance,
router.post("/", middleware.isLoggedIn, function (req, res) {
    //lookup movie using ID
    Movie.findById(req.params.id).exec(function (err, movie) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
        // var chosenCinemaHallName = "blue";
        // var chosenScreeningTime = "midday";
        var chosenCinemaHallName = req.body.cinemaHallName;
        var chosenScreeningTime = req.body.showingHour;
        var seatCounter = createSeatsAtHall(chosenCinemaHallName)
        var newCinemaHall = new CinemaHall;
        newCinemaHall.seats = seatCounter;
        newCinemaHall.name = chosenCinemaHallName;
        CinemaHall.create(newCinemaHall, function (err, savedCinemaHall){
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }
            var newShowing = {showingHour: chosenScreeningTime, movie: movie, cinemaHall: savedCinemaHall}
            Showing.create(newShowing, function (err, showing) {
                if (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
                req.flash("success", "Your have created a showing.");
                res.redirect('/movies/' + movie._id +'/showing');
            });
        })
    });
});

function createSeatsAtHall(chosenCinemaHallName){
    var seatCounter = [];
    var numberOfRows = 5;
    var numberOfSeatsInRow = 8;

    // if(chosenCinemaHallName === "blue"){
    //     numberOfRows = 5;
    //     numberOfSeatsInRow = 8;
    // }else{
    //     numberOfRows = 5;
    //     numberOfSeatsInRow = 4;
    // }

    for( i = 0; i<(numberOfRows*numberOfSeatsInRow); i++){
        seatCounter.push({
            rowNumber: 0,
            seatNumber: 0,
            isReserved: false
        });
    }

    for( i = 0; i < numberOfRows; i++){
        for(j = 0; j < numberOfSeatsInRow; j++){
            seatCounter[i+j].rowNumber = (i%numberOfRows)+1;
            seatCounter[i+j].seatNumber = (j%numberOfSeatsInRow)+1;
            // console.log(seatCounter[i].rowNumber);
            // console.log(seatCounter[i].seatNumber);
        }
    };

    return seatCounter;
}

module.exports = router;