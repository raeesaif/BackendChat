// middleware/authMiddleware.js
import { supabaseAuth } from "../src/config/supabaseAuth.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "No authorization token provided",
        });
    }

    const { data, error } = await supabaseAuth.auth.getUser(token);

    if (error || !data?.user) {
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired token",
        });
    }

    req.user = data.user;
    next();
};
