
var mongoose = require("mongoose");


var showingSchema = new mongoose.Schema({
    showingHour: String,
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie"
    },
    cinemaHall:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "CinemaHall"
    }
});

module.exports = mongoose.model("Showing", showingSchema);