const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req, res, next) => {
  //Read the token from request cookies and validate the user

  try {
    const { token } = req.cookies;
    if(!token){
        return res.status(401).json({message: "You are not authorized"})
    }

    const decodedMessage = await jwt.verify(token, "STACK@MATE#0425");

    const user = await User.findById(decodedMessage._id);
    if (!user) {
      throw new Error("User does not exist");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
};

module.exports = { userAuth };
