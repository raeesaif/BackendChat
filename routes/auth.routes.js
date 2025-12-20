import express from "express"

import { login, signUp, logout, getUser } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/signup", signUp)
router.post("/login", login)
router.post("/logout", logout)
router.get("/get-user", authMiddleware, getUser);

export default router;