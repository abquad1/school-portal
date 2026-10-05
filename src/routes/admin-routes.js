import express from "express";
const router = express.Router();

import { AuthMiddleware } from "../middleware/auth-middleware.js";
import { AdminMiddleware } from "../middleware/admin-middleware.js";
import { promoteStudents } from "../controller/admin-controller.js";

router.post(
  "/promote-students",
  AuthMiddleware,
  AdminMiddleware,
  promoteStudents,
);

export default router;
