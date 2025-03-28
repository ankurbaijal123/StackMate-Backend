const express = require("express")

const app = express();

app.use("/test",(req, res) =>{
    res.send("Hello from server using nodemon");
})

app.use("/hello",(req, res) =>{
    res.send("Hello from Ankur");
})

app.use("/ankur",(req, res) =>{
    res.send("Hello from Ankur Baijal");
})
app.listen(3000, () =>{
    console.log("Server Started")
})