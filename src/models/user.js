const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required : true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20
    },
    emailId: {
        type: String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        minLength: 3,
        maxLength: 20
    },
    password: {
        type: String,
        required : true,
        minLength: 6,
        maxLength: 20
    },
    age: {
        type: Number,
        min : 18,
        max : 100
    },
    gender: {
        type: String,
        lowercase : true,
        validate(value){
            if(!["male", "female","others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl:{
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLCexwutNZt0aSRMrVRLoXtex8XMNyWxjD4Q&s"
    },
    about: {
        type : String,
        default : "Learner"
    },
    skills:{
        type:[String]
    },

},{
    timestamps: true
})

//Now create a mongoose Model
const userModel = mongoose.model('User', userSchema)

module.exports = userModel