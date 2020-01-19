const mongoose = require("mongoose");

async function connect(){
    try{
        await mongoose.connect(
            // mongoose.connect('mongodb://username:password@host:port/database')
            "mongodb://localhost:27017/CentralCinema",{useNewUrlParser: true}
        );
    }catch (err) {
        console.error("Blad polaczenia z baza danych mongodb");
        console.error(err);
    }
}

module.exports = {connect};