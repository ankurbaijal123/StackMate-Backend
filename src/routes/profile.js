const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth")


profileRouter.get("/profile", userAuth, async (req, res) => {
    // get cookies data
    try {
      const user = req.user;
      //Validate the token
       res.send(user);
    } catch (err) {
      res.status(400).send("ERROR : " + err);
    }
  });

  module.exports = profileRouter