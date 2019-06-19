
var mongoose = require("mongoose");

const screening = {
    MIDDAY: "midday",
    EVENING: "evening",
    NIGH: "night"
}

var showingSchema = new mongoose.Schema({
    showingHour: {
        type: screening,
    },
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