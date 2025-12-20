// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 3000;
// const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// app.use(cors({
//     origin: CLIENT_URL,
//     credentials: true,
// }))

// const server = createServer(app)

// const io = new Server(server, {
//     cors: {
//         origin: CLIENT_URL,
//         credentials: true,
//     }
// })

// app.get("/", (req, res) => {
//     res.send("Hello from server");
// })


// const userRooms = new Map();

// io.on("connection", (socket) => {
//     console.log(`User connected: ${socket.id}`)

//     socket.on("join-room", ({ room, name }) => {
//         const userKey = `${socket.id}-${room}`;

//         // Check if user is already in this room
//         if (userRooms.has(userKey)) {
//             console.log(`${name} already in room ${room}`);
//             return;
//         }

//         socket.join(room);
//         userRooms.set(userKey, { room, name });
//         console.log(`${name} join room ${room}`);
//         socket.to(room).emit("notification", `${name} has joined the room`);
//     })

//     socket.on("message", ({ room, name, message }) => {
//         console.log(`Message from ${name} in room ${room}: ${message}`)
//         socket.broadcast.to(room).emit("receive-message", { name, message })
//     })

//     socket.on("leave-room", ({ room, name }) => {
//         const userKey = `${socket.id}-${room}`;
//         socket.leave(room);
//         userRooms.delete(userKey);
//         console.log(`${name} left room ${room}`);
//         socket.to(room).emit("notification", `${name} has left the room`);
//     })

//     // Open Chat 

//     // ✅ When user joins open chat
//     socket.on("open-join-chat", ({ name }) => {
//         socket.join("open-chat-room"); // Join room
//         console.log(`${name} has joined the chat`);
//         socket.to("open-chat-room").emit("open-notification", `${name} has joined the  chat`);
//     });

//     // ✅ When user sends a message
//     socket.on("open-message", ({ name, message }) => {
//         console.log(`Open Message from ${name}: ${message}`);
//         socket.to("open-chat-room").emit("open-receive-message", { name, message });
//     });

//     // ✅ When user leaves open chat
//     socket.on("open-leave-chat", ({ name }) => {
//         socket.leave("open-chat-room");
//         console.log(`${name} has left the open chat`);
//         socket.to("open-chat-room").emit("open-notification", `${name} has left the  chat`);
//     });

//     socket.on("disconnect", () => {
//         console.log(`User disconnected: ${socket.id}`)
//     })



// })





// server.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// })


import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { ENV } from "./src/config/env.js";
import chatSocket from "./sockets/chat.socket.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: ENV.CLIENT_URL, credentials: true },
});

// socket handler
chatSocket(io);

server.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
});
