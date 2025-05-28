const express = require("express")
const validator = require("validator");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();
const bcrypt = require("bcrypt")

authRouter.post("/signUp", async (req, res) => {
    try {
      //Validation of data from user
  
      validateSignUpData(req);
  
      const { firstName, lastName, emailId, password, gender } = req.body;
  
      //Encrypt the password
      const passwordHash = await bcrypt.hash(password, 10);
      // 10-saltrounds, Here salt is a random string
      //Creating new instance of user model
      const user = new User({
        firstName,
        lastName,
        emailId,
        gender,
        password: passwordHash,
      });
  
      const savedUser = await user.save();
      const token = await savedUser.getJWT();
  
      res.cookie("token", token, {expires : new Date(Date.now() + 7 * 3600000)} );
      res.json({message: "User created",
        data: savedUser
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  });

authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
  
      if (!validator.isEmail(emailId)) {
        throw new Error("Invalid EmailTd Format");
      }
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Invalid Credentails");
      }
  
      const isPasswordValid = await user.validatePassword(password);
  
      if (isPasswordValid) {
        const token = await user.getJWT();
  
        res.cookie("token", token, {expires : new Date(Date.now() + 7 * 3600000)} );
        res.json({message : "Logged  in sucessfully, Hi " + user.firstName + " !!", data : user});
      } else {
        throw new Error("Invalid Credentails");
      }
    } catch (error) {
      res.status(400).send("ERROR : " + error.message);
    }
  });

authRouter.post("/logout", async (req, res) =>{
  
  res.cookie("token", null, {expires : new Date(Date.now())});
  res.json({message : "Logged out (Cookie cleared) "})
});
  
module.exports = authRouter