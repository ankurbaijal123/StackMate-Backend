const express = require("express");
const connectDB = require("./src/config/database");
const app = express();
const User = require("./src/models/user");

app.use(express.json());

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
  console.log(req.body);
  //   {
  //     "firstName": "Ankur",
  //     "lastName":"Baijal",
  //     "emailId": "ankur.baijal@gmail.com",
  //     "password":"ankur@123",
  //     "age": 21, b
  //     "gender": "Male"
  // }

  const user = new User(req.body);
  try {
    await user.save();
    res.send("User created");
  } catch (err) {
    res.status(400).send(err.message);
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

    const ALLOWED_UPDATES=["photoUrl", "about", "age", "gender", "skills"]
    const isUpdateAllowed = Object.keys(data).every((k)=>
       ALLOWED_UPDATES.includes(k)
    )
    console.log(isUpdateAllowed);
    if(!isUpdateAllowed){
        throw new Error ("Update not allowed for these fields")
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
    res.status(400).send(err.message );
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
