var mongoose = require("mongoose");

var cinemaHallSchema = new mongoose.Schema({
    name: String,
    seats:[
        {
            rowNumber: Number,
            seatNumber: Number,
            isReserved: Boolean, default: false
        }
    ]
});

module.exports = mongoose.model("CinemaHall", cinemaHallSchema);