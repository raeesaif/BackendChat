import dotenv from "dotenv";
dotenv.config();

export const ENV = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    PORT: process.env.PORT || 3000,
    CLIENT_URL: process.env.CLIENT_URL
        ? process.env.CLIENT_URL.split(",")
        : ["http://localhost:5173"],
};
