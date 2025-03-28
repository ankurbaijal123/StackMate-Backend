const express = require("express")

const app = express();

/* app.use("/user", (req,res)=>{
    res.send("Hahahahahahahah")
}) */
    app.get(/.*fly$/, (req,res)=>{
        res.send("Saved data to db")
    }) // regex a
    app.get("/ab?c", (req,res)=>{
        res.send("Saved data to db")
    }) // b is optional

    app.get("/(ab)?c", (req,res)=>{
        res.send("Saved data to db")
    }) // ab is optional
    


    app.get("/ab+c", (req,res)=>{
        res.send("Saved data to db")
    })   // any number of b

    app.get("/ab*c", (req,res)=>{
        res.send("Saved data to db")
    }) //any thing at place of *

// This will match GET HTTP method API calls to /test
app.get("/user/:userid", (req,res)=>{
    console.log(req.params)
    res.send({firstName:"Ankur", lastName: "Baijal"})
})

app.post("/user", (req,res)=>{
    res.send("Saved data to db")
})

app.patch("/user", (req,res)=>{
    res.send("Updated some data of user")
})

app.delete("/user", (req,res)=>{
    res.send("Deletd user")
})
// This will match all the HTTP method API calls to /test
app.use("/test",(req, res) =>{
    res.send("Hello from server using nodemon test");
})




app.listen(3000, () =>{
    console.log("Server Startedat 3000")
})