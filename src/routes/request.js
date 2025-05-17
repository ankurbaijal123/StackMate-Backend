const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromuser = req.user;
      const fromUserId = fromuser._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "intrested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }

      const toUserIdValid = await User.findById(toUserId);

      /* if(fromUserId.toString() === toUserId.toString()){
        return res.status(400).json({
          message : "User cannot be same"
        })
      } */

      if (!toUserIdValid) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      //if there is existing request in db ??
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingConnectionRequest) {
        throw new Error("Request already exist");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({
        message: fromuser.firstName + " Sent a " + status + " request to " + toUserIdValid.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err.message);
    }
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try { 
    const loggedInUser = req.user;
    const {status, requestId} = req.params
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message: "Status not allowed !"})
    }
    //loggedInuser = toUserId;
    //staus should be intrested , then only accepted or rejected
    //requestId should be valid
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "intrested"
    })
    if(!connectionRequest){
      return res.status(404).json({message: "Connection request not found"})
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save()
    res.json({message: "Connection request " + status, data})
  }
  catch (err){
    res.status(400).send("ERROR : " + err.message)
  }

})
module.exports = requestRouter;