import express from "express";
import {
  login,
  studentRegister,
  teacherRegister,
} from "../controller/auth-controller.js";
// import {AuthMiddleware} from '../middleware/auth-middleware.js'

const router = express.Router();

router.post("/register/student", studentRegister);
router.post("/register/teacher", teacherRegister);
router.post("/login", login);

export default router;
