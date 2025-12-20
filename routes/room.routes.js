import express from "express";
import { createRoom, joinRoom, getMessages } from "../controllers/room.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.post("/join", authMiddleware, joinRoom);
router.get("/:roomId/messages", authMiddleware, getMessages);

export default router;
