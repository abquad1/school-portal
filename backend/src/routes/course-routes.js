import express from "express";
const router = express.Router();
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  assignTeacherToCourse,
} from "../controller/course-controller.js";

import { AuthMiddleware } from "../middleware/auth-middleware.js";
import { AdminMiddleware } from "../middleware/admin-middleware.js";

router.post("/create-course", AuthMiddleware, AdminMiddleware, createCourse);
router.get("/get-all-courses", AuthMiddleware, getAllCourses);
router.patch(
  "/update-course/:id",
  AuthMiddleware,
  AdminMiddleware,
  updateCourse,
);
router.delete("/delete-course", AuthMiddleware, AdminMiddleware, deleteCourse);
router.patch(
  "/:courseId/teacher",
  AuthMiddleware,
  //   requireRole("ADMIN"),
  assignTeacherToCourse,
);

export default router;
