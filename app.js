const express = require("express");
const connectDB = require("./src/config/database");
const app = express();
const validator = require("validator");
const User = require("./src/models/user");
const { validateSignUpData } = require("./src/utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const {userAuth} = require("./src/middlewares/auth")

app.use(express.json());
app.use(cookieParser());
 
connectDB()
  .then(() => {
    console.log("Database connected sucessesfully.....");
    app.listen(3000, () => {
      console.log("Server Started at 3000.....");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });

app.post("/signUp", async (req, res) => {
  try {
    //Validation of data from user

    validateSignUpData(req);

    const { firstName, lastName, emailId, password, gender } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    // 10-saltrounds, Here salt is a random string
    console.log(passwordHash);
    //Creating new instance of user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      gender,
      password: passwordHash,
    });

    await user.save();
    res.send("User created");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/logIn", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid EmailTd");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentails");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {expires : new Date(Date.now() + 7 * 3600000)} );
      res.send("Logged  in sucessfully, Hi " + user.firstName + " !!");
    } else {
      throw new Error("Invalid Credentails");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

//get user by email
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.findById("67ea2d9347095f23793c6198");
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/profile", userAuth, async (req, res) => {
  // get cookies data
  try {
    const user = req.user;
    //Validate the token
     res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err);
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res, next)=>{
  try{
    const user = req.user; 
    res.send(user.firstName + " Sent a Connection request")
  }
  catch(err){
    res.status(400).send("Error : " + err)
  }
}) 

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send("User deleted with id");
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "age", "gender", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    console.log(isUpdateAllowed);
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed for these fields");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "before",
      runValidators: true,
    });
    if (user.length === 0) {
      res.status(404).send("User not found");
    } else {
      console.log(user);
      res.send("User data updated");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});
