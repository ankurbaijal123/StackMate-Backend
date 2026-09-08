const ConnectionRequest = require("../models/connectionRequest");
const { text } = require("express")
const socket = require("socket.io")
const crypto = require("crypto")
const { Chat } = require("../models/chat")

const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex")
}
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true,
        }
    })
    io.on("connection", (socket) => {
        //Handle chat events here
        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const room = getSecretRoomId(userId, targetUserId)
            socket.join(room)
            console.log(firstName + "joined room " + room)
        })
        socket.on("sendMessage",
            async ({ firstName, userId, targetUserId, newMessage, time }) => {
                const roomId = getSecretRoomId(userId, targetUserId)

                try {
                   const isFriend = await ConnectionRequest .findOne({
        $or: [
          { fromUserId: userId, toUserId: targetUserId },
          { fromUserId: targetUserId, toUserId: userId },
        ],
        status: "accepted",
      });
                    
                    if (!isFriend) return
                    let chat = await Chat.findOne({
                        participants: { $all: [userId, targetUserId] }
                    })
                    if (!chat) {
                        chat = new Chat({
                            participants: [userId, targetUserId],
                            messages: []
                        })
                    }
                    chat.messages.push({
                        senderId: userId,
                        text: newMessage,
                        time: time
                    })
                    await chat.save();
                } catch (error) {
                    console.log(error)
                }
                io.to(roomId).emit("messageReceived", { firstName, newMessage, fromUserId: userId, time })
            })
        socket.on("disconnect", () => { })
    })
}
module.exports = initializeSocket;
