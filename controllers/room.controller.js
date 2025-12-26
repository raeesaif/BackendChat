import { supabase } from "../src/config/supabase.js";
import { supabaseAuth } from "../src/config/supabaseAuth.js";

export const createRoom = async (req, res) => {
    try {
        const { roomName, isPrivate } = req.body;
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });
        const userId = req.user.id;

        // Check if room name already exists
        const { data: existingRoom } = await supabase
            .from("private_rooms")
            .select("id")
            .eq("room_name", roomName)
            .limit(1);

        if (existingRoom && existingRoom.length > 0) {
            return res.status(409).json({ 
                error: "Room name already exists", 
                message: "Room name already created. Please choose a unique name." 
            });
        }

        const { data: room, error } = await supabase
            .from("private_rooms")
            .insert({
                room_name: roomName,
                is_private: isPrivate,
                created_by: userId,
            })
            .select()
            .single();

        if (error) return res.status(400).json(error);

        const { error: memberError } = await supabase.from("room_members").insert({
            room_id: room.id,
            user_id: userId,
        });

        if (memberError) return res.status(400).json(memberError);

        res.json({ room });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const joinRoom = async (req, res) => {
    try {
        const { roomName } = req.body;
        const userId = req.user.id;

        // Find room by name using service role to bypass RLS
        const { data: rooms, error: roomError } = await supabase
            .from("private_rooms")
            .select("id, room_name")
            .eq("room_name", roomName)
            .limit(1);

        if (roomError || !rooms || rooms.length === 0) {
            return res.status(404).json({ 
                error: "Room not found", 
                details: roomError,
                searchedFor: roomName 
            });
        }

        const room = rooms[0]; // Get first matching room
        const roomId = room.id;

        // Check if already a member
        const { data: exists } = await supabase
            .from("room_members")
            .select("*")
            .eq("room_id", roomId)
            .eq("user_id", userId)
            .maybeSingle();

        if (!exists) {
            await supabase.from("room_members").insert({
                room_id: roomId,
                user_id: userId,
            });
        }

        res.json({ message: "Joined room", roomId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("room_id", roomId)
            .order("created_at", { ascending: true });

        if (error) return res.status(400).json(error);
        res.json({ messages: data || [] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
