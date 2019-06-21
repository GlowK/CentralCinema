// ============================
// Uzupełnianie bazy danych o przykladowe filmy na stronie poczatkowej
// + czyszczenie bazy jak smieci powstawiamy
// gdy bedziemy uzywac jednej zdalnej bazy, tylko czyszczenie sie przyda
// ============================

var mongoose = require("mongoose");
var Movie = require("./models/movie");
var Comment   = require("./models/comment");

var data = [
    {
        name: "Pulp Fiction", 
        image: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,686,1000_AL_.jpg",
        description: "The lives of two mob hitmen, a boxer, a gangster & his wife, and a pair of diner bandits intertwine in four tales of violence and redemption. ",
        trailer: "tGpTpVyI_OQ",
        author:{
            id: "5cec25534a17550c1ceed87e",
            username:"a"
        }
    }
]

var commentExample = [
    {
        text: "Dupa",
        author:{
            id: "5cec25534a17550c1ceed87e",
            username: "a"
        }
    }
]
    
function seedDB(){
    //Remove all movies
    Movie.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("movies removed!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("comments removed!");
                //add a few movies
            data.forEach(function(seed){
                Movie.create(seed, function(err, movie){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a movie");
                    }
                });
            });
        });
    }); 
}
    
module.exports = seedDB;