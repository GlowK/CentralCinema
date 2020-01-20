const User = require("../models/user");

exports.createNewUser = async (req, res, next) =>{
    try{
        const createdUser = await User.create(req.body);
        res.status(201).json(createdUser);
    }catch(err){
        next(err);
    }
};

//Jesli uzyjemy User.create(); bez podania paramterów,
    // nasza funkcja testowa zwroci blad 
    //User.create();