import app from "./app.js";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/index.js";
import cookieParser from "cookie-parser";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import noteRoutes from "./routes/note.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config({
  path: "./.env",
});
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

// ROUTES
app.get("/", (req, res) => {
  res.send("FIRST POINT OF PROJECT OVER THE PORT NO - " + PORT);
});

app.use("/api/v1/", authRoutes);
app.use("/api/v1/", projectRoutes);
app.use("/api/v1/", noteRoutes);
app.use("/api/v1/", taskRoutes);

// Starting Server Only When DB Is Connected
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongodb connection error", err);
    process.exit(1);
  });
