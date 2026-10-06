import { prisma } from "../config/db.js";

export const createSession = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is needed",
      });
    }

    const sessionPattern = /^(\d{4})\/(\d{4})$/;
    const match = name.match(sessionPattern);

    if (!match || Number(match[2]) !== Number(match[1]) + 1) {
      return res.status(400).json({
        success: false,
        message: "Session name must be in the format YYYY/YYYY, e.g. 2025/2026",
      });
    }

    const existingSession = await prisma.academicSession.findUnique({
      where: { name },
    });

    if (existingSession) {
      return res.status(400).json({
        success: false,
        message: "This Academic Session already exists",
      });
    }

    const session = await prisma.academicSession.create({
      data: {
        name,
        terms: {
          create: [{ term: FIRST }, { term: SECOND }, { term: THIRD }],
        },
      },
      include: {
        terms: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Academic session has been created successfully",
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await prisma.academicSession.findMany({
      include: { terms: true },
      orderBy: { name: "desc" },
    });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};

export const setCurrentTerm = async (req, res) => {
  try {
    const { sessionTermId } = req.params;

    if (!sessionTermId) {
      return res.status(400).json({
        success: false,
        message: "sessionTermId is needed",
      });
    }

    const sessionTerm = await prisma.sessionTerm.findUnique({
      where: { id: sessionTermId },
    });

    if (!sessionTerm) {
      return res.status(404).json({
        success: false,
        message: "sessionTerm not found",
      });
    }

    const [, updatedTerms] = await prisma.$transaction([
      prisma.sessionTerm.updateMany({
        where: { sessionTermId: { not: sessionTermId } },
        data: { isCurrent: false },
      }),
      prisma.sessionTerm.update({
        where: { id: sessionTermId },
        data: { isCurrent: true },
      }),
    ]);

    res.status(200).json({
      success: true,
      message: "Current term has been set successfully",
      updatedTerms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
