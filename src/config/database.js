
const mongoose = require("mongoose")

const connectDB = async() =>{
    await mongoose.connect(
        "mongodb+srv://ankurbaijal:eUw.nMYfv9jsJWN@namastenode.wtalbza.mongodb.net/StackMate"
    ) 
}

module.exports = connectDB;



