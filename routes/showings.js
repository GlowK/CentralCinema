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
        Showing.find({movie: movie._id}, (err, allShowings) => {
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            }
            res.render("showings/new", {movie: movie, allShowings: allShowings});
        });    
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

<<<<<<< Updated upstream
=======
// ============================
// RESERVE - more information about the movie
// ============================
router.get("/:id", middleware.isLoggedIn, (req,res) => {
    Showing.findById(req.params.id).exec((err, foundShowing) =>{
        if(err){
            console.log(err);
        }else{
            //console.log(foundMovie);
            CinemaHall.findById(foundShowing.cinemaHall._id).exec((err, foundCinema) => {
                if(err){
                console.log(err);
                }else{
                    res.render("showings/reserve" , {showing: foundShowing, cinemaHall: foundCinema});
                }
            })
            
        }
    } )
});

// ============================
// SHOWING - UPDATE NIEDOKONCZONE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO
// ============================
router.put("/:id", middleware.isLoggedIn, (req, res) => {
    Showing.findByIdAndUpdate(req.params.id, req.body.showing, (err, updatedShowing) =>{
        if(err){
            res.redirect("back");
        }else{
            CinemaHall.findByIdAndUpdate(updatedShowing._id, (err, updatedCinemaHall) =>{
                if(err){
                    res.redirect("back");
                }
                res.redirect("/showings/" + req.params.id);
            });
        }
    })
});

>>>>>>> Stashed changes
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

    // for( i = 0; i < numberOfRows; i++){
    //     for(j = 0; j < numberOfSeatsInRow; j++){
    //         seatCounter[i+j].rowNumber = (i%numberOfRows)+1;
    //         seatCounter[i+j].seatNumber = (j%numberOfSeatsInRow)+1;
    //         // console.log(seatCounter[i].rowNumber);
    //         // console.log(seatCounter[i].seatNumber);
    //     }
    // };

    var seatCount = 0;
    for(i = 0;i < numberOfRows;i++)
    {
        for(j = 0; j < numberOfSeatsInRow ; j++)
        {
            seatCounter[seatCount].rowNumber = i+1;
            seatCounter[seatCount].seatNumber = j+1;
            seatCount++;
        }
    }

    return seatCounter;
}

module.exports = router;