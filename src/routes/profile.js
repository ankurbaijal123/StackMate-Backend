const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user.js")
const {userAuth} = require("../middlewares/auth")
const {validateProfileData} = require("../utils/validation");
const { findByIdAndUpdate } = require("../models/user");


profileRouter.get("/profile/view", userAuth, async (req, res) => {
    // get cookies data
    try {
      const user = req.user;
      //Validate the token
       res.json({data : user});
    } catch (err) {
      res.status(400).send("ERROR : " + err);
    }
  });

profileRouter.patch("/profile/edit", userAuth, async (req, res) =>{
  try{
    const isAllowed = validateProfileData(req);
    if(!isAllowed){
      throw new Error("Invalid edit data")
    }
    const user = req.user;
    user.set(req.body);

    // Save the updated user; this will run all validators and pre-save hooks
    await user.save();
    
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.json({message: `${user.firstName}'s data updated`,
        data: user
      });
    }

  }
  catch(err){
    res.status(400).send("ERROR: " + err.message)
  }
})



  module.exports = profileRouter