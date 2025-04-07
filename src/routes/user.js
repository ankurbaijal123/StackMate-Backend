const express = require("express")
const userRouter = express.Router();
const User = require("../models/user.js")
const {userAuth} = require("../middlewares/auth")

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

  module.exports = userRouter