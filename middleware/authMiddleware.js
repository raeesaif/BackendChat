// middleware/authMiddleware.js
import { supabaseAuth } from "../src/config/supabaseAuth.js";

export const authMiddleware = async (req, res, next) => {
    console.log("=== AUTH MIDDLEWARE DEBUG ===");
    console.log("Headers:", req.headers.authorization);
    
    const token = req.headers.authorization?.replace("Bearer ", "");
    console.log("Token:", token ? "Present" : "Missing");

    if (!token) {
        console.log("No token - returning 401");
        return res.status(401).json({
            status: "error",
            message: "No authorization token provided",
        });
    }

    const { data, error } = await supabaseAuth.auth.getUser(token);
    console.log("Auth result:", { user: data?.user?.id, error });

    if (error || !data?.user) {
        console.log("Auth failed - returning 401");
        return res.status(401).json({
            status: "error",
            message: "Invalid or expired token",
        });
    }

    console.log("Auth success - proceeding to route");
    req.user = data.user;
    next();
};
