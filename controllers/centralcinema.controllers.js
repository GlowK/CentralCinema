const User = require("../models/user");

exports.createNewUser = async (req, res, next) =>{
    const createdUser = await User.create(req.body);
    res.status(201).json(createdUser);
};

//Jesli uzyjemy User.create(); bez podania paramterów,
    // nasza funkcja testowa zwroci blad 
    //User.create();