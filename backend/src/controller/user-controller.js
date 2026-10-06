import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            enrollment: {
              include: {
                result: true,
                course: true,
              },
            },
          },
        },
        teacher: {
          include: {
            enrollment: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    console.log("req.user:", req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Profile not found for this user",
      });
    }

    if (user.role === "STUDENT") {
      return res.status(200).json({
        success: true,
        message: "profile fetched successfully",
        email: user.email,
        student: user.student,
      });
    } else if (user.role === "TEACHER") {
      return res.status(200).json({
        success: true,
        message: "profile fetched successfully",
        email: user.email,
        teacher: user.teacher,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
