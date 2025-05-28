const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 20,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format : " + value);
        }
      },
    },

    password: {
      type: String,
      required: true,
      minLength: 6,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password must be 6-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
          );
        }
      },
    },

    age: {
      type: Number,
      min: 18,
      max: 100,
    },

    gender: {
      type: String,
      lowercase: true,
      enum: {
        values: ["male", "female", "others"],
        message : `{VALUE} is not a valid gender type`
      },
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },

    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLCexwutNZt0aSRMrVRLoXtex8XMNyWxjD4Q&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("PhotoUrl must be a URL.");
        }
      },
    },

    about: {
      type: String,
      default: "Learner",
      validate(value) {
        if (value.length > 500) {
          throw new Error("About section must be 500 characters or less.");
        }
      },
    },

    skills: {
      type: [String],
      validate(value) {
        if (value.length > 10) {
          throw new Error("Skills more than 10 not allowed");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

/* userSchema.index({
  firstName: 1,
  lastName : 1,
}) */

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "STACK@MATE#0425", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordhash = user.password
  const isPasswordvalid = await bcrypt.compare(password, passwordhash);

  return isPasswordvalid;
}
// Now create a mongoose Model
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
