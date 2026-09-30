import express from "express";
import { profile } from "../controller/user-controller.js";

import { AuthMiddleware } from "../middleware/auth-middleware.js";

const router = express.Router();

router.get("/profile/me", AuthMiddleware, profile);

export default router;
