import { prisma } from "../config/db.js";

export const createCourse = async (req, res) => {
  try {
    const { title, department } = req.body;

    if (!title || !department) {
      return res.status(400).json({
        success: false,
        message: "Title and departmentId are required",
      });
    }
    const titleExists = await prisma.course.findUnique({
      where: { title },
    });
    if (titleExists) {
      return res.status(400).json({
        success: false,
        message: "Title already exists",
      });
    }
    const course = await prisma.course.create({
      data: {
        title,
        department,
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const { department } = req.query;

    const courses = await prisma.course.findMany({
      where: department ? { department } : undefined,
      orderBy: { title: "asc" },
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department } = req.body;

    const course = await prisma.course.update({
      where: { id },
      data: { title, department },
    });

    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    course = await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: "course deleted",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (error.code === "P2023") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete a course with existing enrollments",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const assignTeacherToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { teacherId } = req.body;

    const course = await prisma.course.update({
      where: { courseId },
      data: { teacherId },
      include: { teacher: true },
    });

    res.status(200).json({
      success: true,
      message: "course updated successfully",
      course,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Course or teacher not found" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
