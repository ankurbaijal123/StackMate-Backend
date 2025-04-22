const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectRequest = require("../models/connectionRequest");
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
      const existingConnectionRequest = await ConnectRequest.findOne({
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

      const connectionRequest = new ConnectRequest({
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
      res.status(400).send("Error : " + err);
    }
  }
);

requestRouter.post(
  "/request/send/accepted/:userId",
  userAuth,
  async (req, res, next) => {
    try {
      const fromuser = req.user;
      const fromUserId = fromuser._id;
      const toUserId = req.params.userId;
      const status = req.params.status;
      const toUserIdValid = await User.findById(toUserId);

      /* if(fromUserId.toString() === toUserId.toString()){
        return res.status(400).json({
          message : "User cannot be same"
        })
      } */
      const loggedinid = req.user._id;
      if (!loggedinid.toString() === toUserId.toString()) {
        throw new Error("Invalid user");
      }

      if (!toUserIdValid) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      //if there is existing request in db ??
      const existingConnectionRequest = await ConnectRequest.findOne({
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

      const connectionRequest = new ConnectRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({
        message: fromuser.firstName + " Sent a Connection request",
        data,
      });
    } catch (err) {
      res.status(400).send("Error : " + err);
    }
  }
);

module.exports = requestRouter;