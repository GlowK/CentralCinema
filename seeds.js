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
        name: "PulpFiction", 
        image: "https://cdn.shopify.com/s/files/1/1416/8662/products/pulp_fiction_travolta_original_film_art_spo_2000x.jpg?v=1551893408",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum",
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