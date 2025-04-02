  
  const validator = require("validator")
  const validateSignUpData = (req) =>{
        const {firstName, lastName, emailId, password} = req.body;

        if(!firstName || !lastName){
            throw new Error ("Name is not valid")
        }
        else if(firstName.length < 3 && firstName.length > 20){
            throw new Error ("FirstName should be 3 to 20 Characters")
        }
        else if(lastName.length < 3 && lastName.length > 20){
            throw new Error ("LastName should be 3 to 20 Characters")
        }
        else if(!validator.isEmail(emailId)){
            throw new Error ("EmailId is not valid")
            
        }
        else if(!validator.isStrongPassword(password)){
            throw new Error ("Password is not strong")
        }
  }

  module.exports = {validateSignUpData}