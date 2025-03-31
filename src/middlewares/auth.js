const adminAuth = (req, res, next)=>{
    const token = "xyz"
    const isadminAuthorized = token === "xyz";
    console.log("Admin auth checked")
    if(isadminAuthorized){
        next()
    }
    else{
        res.status(401).send("Unauthorized")
    }}

    const userAuth = (req, res, next)=>{
        const token = "xyz"
        const isadminAuthorized = token === "xyz";
        console.log("Admin auth checked")
        if(isadminAuthorized){
            next()
        }
        else{
            res.status(401).send("Unauthorized")
        }}

    module.exports = {adminAuth, userAuth}