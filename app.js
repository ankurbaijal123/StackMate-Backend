const express = require("express");

const app = express();

/* app.use("/user", (req,res)=>{
    res.send("Hahahahahahahah")
}) */
app.get(
  "/user",
  (req, res, next) => {
    console.log("user api called");
    next();
    //res.send("user data here")
  },
  (req, res, next) => {
    //res.send("user 2 data")
    console.log("user 2 api called");
    next();
  },
  (req, res, next) => {
    //res.send("user 3 data")
    console.log("user 3 api called");
    next();
  },
  (req, res, next) => {
    //res.send("user 4 data")
    console.log("user 4 api called");
    next()
  }    
); // code is executed line by line

app.listen(3000, () => {
  console.log("Server Started at 3000.....");
});
