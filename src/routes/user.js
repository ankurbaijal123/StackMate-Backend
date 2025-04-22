const express = require("express")
const userRouter = express.Router();
const User = require("../models/user.js")
const validator = require("validator");
const {userAuth} = require("../middlewares/auth")
const {validatePassword} = require("../utils/validation");
const bcrypt = require("bcrypt")

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
      const users = await User.find({});
      if (users.length === 0) {
        res.status(404).send("User not found");
      } else {
        res.send(users);
      }
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  });

 userRouter.delete("/user", async (req, res) => {
    try {
      const userId = req.body.userId;
      const user = await User.findByIdAndDelete(userId);
      if (user.length === 0) {
        res.status(404).send("User not found");
      } else {
        res.send("User deleted with id");
      }
    } catch (err) {
      res.status(400).send("Something went wrong");
    }
  });
  
 userRouter.patch("/user", async (req, res) => {
    try {
      const userId = req.body.userId;
      const data = req.body;
      const user = await User.findByIdAndUpdate(userId, data, {
        returnDocument: "before", 
        runValidators: true,
      });
      if (user.length === 0) {
        res.status(404).send("User not found");
      } else {
        console.log(user);
        res.send("User data updated");
      }
    } catch (err) {
      res.status(400).send(err.message);
    }
  });
  
userRouter.patch("/user/changepassword", userAuth, async (req, res)=>{
  try{
    console.log(req.body)
    if(!validatePassword(req)){
      throw new Error("Invalid Data")
    }
    if(req.body.currentPassword === req.body.newPassword){
      throw new Error("Try a different Password")
    }
  
    if(!validator.isStrongPassword(req.body.newPassword)){
      throw new Error("Password is not strong")
    }
  
    if(req.body.newPassword !== req.body.confirmPassword){
      throw new Error("Both Password do not match")
      
    }
    const {newPassword} = req.body
    
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const user = req.user;
    user.password = passwordHash
  
    await user.save()
    res.json({message: "Password updated Sucessfully"})
  }
  catch (err){
    res.status(400).send("ERROR : " + err)
  }
})
  module.exports = userRouter