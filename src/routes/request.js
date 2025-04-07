const express = require("express")
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res, next)=>{
    try{
      const user = req.user; 
      res.send(user.firstName + " Sent a Connection request")
    }
    catch(err){
      res.status(400).send("Error : " + err)
    }
  }) 

  module.exports = requestRouter;

  