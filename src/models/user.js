const mongoose = require("mongoose");
const validator = require("validator")
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
          if (!validator.isEmail(value)){
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
            throw new Error("Password must be 6-20 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.");
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
        if (value.length > 250) {
          throw new Error("About section must be 250 characters or less.");
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

// Now create a mongoose Model
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
