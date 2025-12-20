import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import { ENV } from "./src/config/env.js";
import roomRouter from "./routes/room.routes.js";
const app = express();

app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/room", roomRouter)
export default app;
