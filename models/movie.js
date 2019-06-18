var mongoose = require("mongoose");
     
var movieSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author:{
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   reviews: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Review"
      }
  ],
  rating: {
      type: Number,
      default: 0
  }
});
 
module.exports = mongoose.model("Movie", movieSchema);