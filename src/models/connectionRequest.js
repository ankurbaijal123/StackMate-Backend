const mongoose = require("mongoose");

const connectRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      requred: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "intrested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//compound indexing

connectRequestSchema.index({
  fromUserId : 1,
  toUserId : 1
})

connectRequestSchema.pre("save", function (next){
  const connectionRequest = this;
  // check if from user id and to user id are same
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error ("You cannot send the request to yourself")
  }
  next()

})

const ConnectRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectRequestSchema
);
module.exports = ConnectRequestModel;
