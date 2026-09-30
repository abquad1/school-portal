import "dotenv/config";

import express from "express";
import authRoutes from "./routes/auth-routes.js";
import userRoutes from "./routes/user-routes.js";

const { connectDB, disconnectDB } = await import("./config/db.js");
connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

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
