- Order of routes matter a lot
- Postman app
- make a workspace and test api call

- write a logic to handle GET, POST, PATCH, DELETE API

- multiple route handlers along with res, req, next and errors we can get

- Middleware
- How JS basically handles request behind the scenes

- Connect with your cluster in db (MongoAtlas)
- Install mongoose
- Connect your app with your database "Connection url + (/StackMate)"
- Call your ConnectDB func and connect todatabase

**NEVER TRUST req.body **

** ALL THE API'S WE NEED FOR STACKMATE**

** Auth Router **
- POST /signup
- POST /login
- POST /logout


** Profile Router **
- GET /profile
- Patch /profile/edit
- Patch /profile/password

** ConnectionRequest Router **
- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

** User Router **
- GET /user/connection
- GET /user/request/received
- GET /user/feed - Gets you the profile of other users.

Status: ignore, intrested, accepted, rejected


