require("dotenv").config();

const express = require("express");
const connectDB = require("./src/config/database");
const app = express();
const cookieParser = require("cookie-parser");
const authRouter = require("./src/routes/auth")
const profileRouter = require("./src/routes/profile")
const requestRouter = require("./src/routes/request")
const userRouter = require("./src/routes/user")
const paymentRouter = require("./src/routes/payment");
const cors = require("cors")
const http = require("http");
const initializeSocket = require("./src/utils/socket");
const chatRouter = require("./src/routes/chat");
require("./src/utils/cronjob")

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Requests without an Origin header include health checks and server-to-server calls.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
// Razorpay signs the raw request body, so its webhook must be parsed before
// the application-wide JSON parser runs.
app.use("/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter)
 const server = http.createServer(app)
 initializeSocket(server)
connectDB()
  .then(() => {
    console.log("Database connected sucessesfully.....");
    const port = process.env.PORT || 3000;
    server.listen(port, "0.0.0.0", () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });










// //get user by email
// app.get("/user", async (req, res) => {
//   try {
//     const userEmail = req.body.emailId;
//     const user = await User.findById("67ea2d9347095f23793c6198");
//     if (user.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send(user);
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.delete("/user", async (req, res) => {
//   try {
//     const userId = req.body.userId;
//     const user = await User.findByIdAndDelete(userId);
//     if (user.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       res.send("User deleted with id");
//     }
//   } catch (err) {
//     res.status(400).send("Something went wrong");
//   }
// });

// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params?.userId;
//   const data = req.body;
//   try {
//     const ALLOWED_UPDATES = ["photoUrl", "about", "age", "gender", "skills"];
//     const isUpdateAllowed = Object.keys(data).every((k) =>
//       ALLOWED_UPDATES.includes(k)
//     );
//     console.log(isUpdateAllowed);
//     if (!isUpdateAllowed) {
//       throw new Error("Update not allowed for these fields");
//     }

//     const user = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "before",
//       runValidators: true,
//     });
//     if (user.length === 0) {
//       res.status(404).send("User not found");
//     } else {
//       console.log(user);
//       res.send("User data updated");
//     }
//   } catch (err) {
//     res.status(400).send(err.message);
//   }
// });


