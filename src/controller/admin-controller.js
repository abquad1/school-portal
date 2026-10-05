import { prisma } from "../config/db.js";

const classOrder = ["JSS1", "JSS2", "JSS3", "SS1", "SS2", "SS3"];
const PASS_MARK = 50;

export const promoteStudents = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "SessionId is required",
      });
    }

    const thirdTerm = await prisma.sessionTerm.findUnique({
      where: { sessionId_term: { sessionId, term: "THIRD" } },
    });

    if (!thirdTerm) {
      return res.status(400).json({
        success: false,
        message: "Third term not found for this session",
      });
    }

    const students = await prisma.student.findMany({
      where: { graduated: false },
      include: {
        enrollment: {
          where: {
            sessionTermId: thirdTerm.id,
          },
          include: { result: true },
        },
      },
    });

    const outcomes = [];

    for (student of students) {
      const results = student.enrollment.map((e) => e.result).filter(Boolean);

      if (results.length === 0) {
        outcomes.push({ studentId: student.id, status: "SKIPPED_NO_RESULTS" });
        continue;
      }

      const totals = results.map((r) => r.assignment + r.test + r.exam);
      const average = totals.reduce((sum, t) => sum + t, 0) / totals.length;

      const currentIndex = classOrder.indexOf(student.class);
      const isFinalClass = currentIndex === classOrder.length - 1;
      const passed = average >= PASS_MARK;

      if (!passed) {
        outcomes.push({ studentId: student.id, status: "REPEATED", average });
        continue;
      }

      await prisma.student.update({
        where: {
          id: student.id,
          data: isFinalClass
            ? { graduated: true }
            : { class: classOrder[currentIndex + 1] },
        },
      });
    }
    outcomes.push({
      studentId: student.id,
      status: isFinalClass ? "GRADUATED" : "PROMOTED",
      average,
    });

    res.status(200).json({ success: true, outcomes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
