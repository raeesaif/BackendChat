import { supabase } from "../src/config/supabase.js";

export const createRoom = async (req, res) => {
    try {
        const { roomName, isPrivate } = req.body;
        if (!req.user) return res.status(401).json({ error: "Unauthorized" });
        const userId = req.user.id;

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

        // Find room by name
        const { data: room, error: roomError } = await supabase
            .from("private_rooms")
            .select("id")
            .eq("room_name", roomName)
            .single();

        if (roomError || !room) {
            return res.status(404).json({ error: "Room not found" });
        }

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
