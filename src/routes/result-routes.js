import express from "express";
const router = express.Router();

import { AuthMiddleware } from "../middleware/auth-middleware.js";
import { AdminMiddleware } from "../middleware/admin-middleware.js";
import {
  createOrUpdateResult,
  getStudentReportCard,
} from "../controller/result-controller.js";

router.post("/", AuthMiddleware, AdminMiddleware, createOrUpdateResult);
router.get("/student/:studentId", AuthMiddleware, getStudentReportCard);

export default router;
