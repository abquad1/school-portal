import "dotenv/config";

import express from "express";
import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";
import courseRoutes from "./routes/course-routes.js";
import sessionRoutes from "./routes/session-routes.js";
import resultRoutes from "./routes/result-routes.js";
import adminRoutes from "./routes/admin-routes.js";

const { connectDB, disconnectDB } = await import("./config/db.js");
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/admin", adminRoutes);

const PORT = 5001;
const server = app.listen(PORT, () => {
  console.log(`server running successfully on ${PORT}`);
});

process.on("unhandledRejection", async (err) => {
  console.error("unhandled rejection", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

process.on("uncaughtException", async (err) => {
  console.error("uncaught Exception", err);
  await disconnectDB();
  process.exit(1);
});

process.on("SIGTERM", async (err) => {
  console.error("SIGTERM received, shutting down successfully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});
