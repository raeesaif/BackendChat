import { supabase } from "../src/config/supabase.js";

export default function (io) {
    const userRooms = new Map();

    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`)

        socket.on("join-room", ({ roomId, name }) => {
            socket.join(roomId);
            socket.to(roomId).emit("notification", `${name} joined the room`);
        });


        socket.on("typing", ({ roomId, name }) => {
            socket.to(roomId).emit("user-typing", { name });
        });

        socket.on("stop-typing", ({ roomId }) => {
            socket.to(roomId).emit("user-stop-typing");
        });

        socket.on("delete-message", async ({ roomId, messageId, userId }) => {
            // Delete from DB
            await supabase.from("messages")
                .delete()
                .eq("id", messageId)
                .eq("sender_id", userId);

            // Broadcast deletion
            io.to(roomId).emit("message-deleted", { messageId });
        });

        socket.on("send-message", async ({ roomId, senderId, senderName, message, imageUrl, messageType }) => {
            // Save in DB
            await supabase.from("messages").insert({
                room_id: roomId,
                sender_id: senderId,
                message,
                image_url: imageUrl || null,
                message_type: messageType || 'text',
            });

            // Real-time broadcast to all in room
            io.to(roomId).emit("receive-message", {
                senderName,
                message,
                imageUrl,
                messageType,
                created_at: new Date(),
            });
        });
        socket.on("leave-room", ({ room, name }) => {
            const userKey = `${socket.id}-${room}`;
            socket.leave(room);
            userRooms.delete(userKey);
            console.log(`${name} left room ${room}`);
            socket.to(room).emit("notification", `${name} has left the room`);
        })

        // Open Chat 

        // ✅ When user joins open chat
        socket.on("open-join-chat", ({ name }) => {
            socket.join("open-chat-room"); // Join room
            console.log(`${name} has joined the chat`);
            socket.to("open-chat-room").emit("open-notification", `${name} has joined the  chat`);
        });

        // ✅ When user is typing in open chat
        socket.on("open-typing", ({ name }) => {
            socket.to("open-chat-room").emit("open-user-typing", { name });
        });

        socket.on("open-stop-typing", () => {
            socket.to("open-chat-room").emit("open-user-stop-typing");
        });

        // ✅ When user sends a message
        socket.on("open-message", ({ name, message }) => {
            console.log(`Open Message from ${name}: ${message}`);
            io.to("open-chat-room").emit("open-receive-message", { name, message });
        });

        // ✅ When user leaves open chat
        socket.on("open-leave-chat", ({ name }) => {
            socket.leave("open-chat-room");
            console.log(`${name} has left the open chat`);
            socket.to("open-chat-room").emit("open-notification", `${name} has left the  chat`);
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`)
        })



    })

}