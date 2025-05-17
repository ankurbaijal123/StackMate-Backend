const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const Users = require("../models/user");
const { connection } = require("mongoose");
const USER_SAVE_DATA = "firstName lastName photoUrl age gender about skills";
//get all the pending connection request for the logged in user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInuser._id,
      status: "intrested",
    }).populate("fromUserId", USER_SAVE_DATA);
    res.json({
      message: "These are the fetched request",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).json({ message: "No request found or Invalid user" });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAVE_DATA)
      .populate("toUserId", USER_SAVE_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ message: "Your Connections ", data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});
module.exports = userRouter;

userRouter.get("/feed?page=1&limit=10", userAuth, async (req, res) => {
  try {
    const loggedInuser = req.user;
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;
     
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInuser._id }, { fromUserId: loggedInuser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.toUserId.toString());
      hideUsersFromFeed.add(req.fromUserId.toString());
    });

    const users = await Users.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInuser._id } },
      ],
    }).select(USER_SAVE_DATA).skip((page-1)*limit).limit(limit);    
    res.send(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
