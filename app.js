const express = require("express");

const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth")

app.use("/admin", adminAuth)


app.post("/user/login", (req, res)=>{
    res.send("Logged innnn")
})

app.use("/user", userAuth, (req, res)=>{
    res.send("All Data sent")
})

app.get("/admin/getAllData", (req, res)=>{
    res.send("All Data sent")
})

app.get("/admin/deleteUser", (req, res)=>{
    res.send("User Deleted")
})
app.listen(3000, () => {
  console.log("Server Started at 3000.....");
});
