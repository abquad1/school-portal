import { prisma } from "../config/db.js";

export const createOrUpdateResult = async (req, res) => {
  try {
    const { enrollmentId, assignment, test, exam } = req.body;

    if (
      !enrollmentId ||
      assignment === undefined ||
      test === undefined ||
      exam === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "enrollmentId,assignment, test and exam are required",
      });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      return res.status(400).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    if (
      req.user.role === "TEACHER" &&
      enrollment.teacherId !== req.user.teacher.id
    ) {
      return res.status(400).json({
        success: false,
        message: "User not permitted",
      });
    }

    const course = await prisma.course.upsert({
      where: { enrollment },
      update: { assignment, test, exam },
      create: { enrollmentId, assignment, test, exam },
    });

    res.status(200).json({
      success: true,
      message: "Resut saved successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStudentReportCard = async (req, res) => {
  try {
    const { studentId } = req.params;

    if (req.user.role === "STUDENT" && req.user.student.id !== studentId) {
      return res.status(400).json({
        success: false,
        message: "User not permitted",
      });
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
      include: {
        enrollment: {
          include: {
            course: true,
            teacher: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            result: true,
            sessionTerm: {
              include: {
                include: {
                  session: true,
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const subjects = student.enrollment.map((e) => {
      const total = e.result
        ? e.result.assignment + e.result.test + e.result.exam
        : null;

      return {
        course: e.course.title,
        teacher: `${e.teacher.firstName} ${e.teacher.lastName}`,
        term: e.sessionTerm.session.name,
        scores: e.result,
        total,
      };
    });

    res.status(200).json({
      success: true,
      message: "Report card fetched successfully",
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        class: student.class,
      },
      subjects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
