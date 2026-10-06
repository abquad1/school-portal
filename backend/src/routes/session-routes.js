import express from "express";
const router = express.Router();
import {
  createSession,
  getAllSessions,
  setCurrentTerm,
} from "../controller/academic-session-controller.js";
import { getCurrentTerm } from "../helpers/get-current-term.js";

import { AuthMiddleware } from "../middleware/auth-middleware.js";
import { AdminMiddleware } from "../middleware/admin-middleware.js";

router.post("/create-session", AuthMiddleware, AdminMiddleware, createSession);
router.get("/get-all-sessions", AuthMiddleware, getAllSessions);
router.patch(
  "/set-current-term/:sessionTermId",
  AuthMiddleware,
  AdminMiddleware,
  setCurrentTerm,
);
router.get(
  "/get-current-term",
  AuthMiddleware,
  AdminMiddleware,
  getCurrentTerm,
);

export default router;
