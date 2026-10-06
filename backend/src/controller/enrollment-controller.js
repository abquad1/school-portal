import { prisma } from "../config/db.js";
import { getCurrentTerm } from "../helpers/get-current-term";

export const enrollStudent = async (req, res) => {
  try {
    const { studentId, teacherId } = req.body;

    if (!studentId || !teacherId) {
      return res.status(400).json({
        success: false,
        message: "studentId and courseId are required",
      });
    }

    const course = await prisma.course.findUnique({
      where: { courseId },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "course not found",
      });
    }

    const currentTerm = await getCurrentTerm();

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId,
        studentId,
        teacherId: course.teacherId,
        sessionTerm: currentTerm.id,
      },
      include: { teacher: true, course: true },
    });

    res.status(201).json({
      success: true,
      message: "student enrolled successfully",
      enrollment,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message:
          "Student is already enrolled in this course for the current term",
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStudentEnrollments = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "STUDENT" && req.user.student.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: "User not permitted",
      });
    }
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId, sessionTermId: currentTerm.id },
      include: { course: true, teacher: true, result: true },
    });

    const currentTerm = await getCurrentTerm();

    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTeacherEnrollments = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const currentTerm = await getCurrentTerm();

    if (req.user.role === "TEACHER" && req.user.teacher.id !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "User not permitted",
      });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { teacherId, sessionTermId: currentTerm.id },
      include: { student: true, course: true, result: true },
    });

    res.status(200).json({
      success: true,
      message: "teacher enrolled successfully",
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
