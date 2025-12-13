import app from "./app.js";
import dotenv from "dotenv";
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

// ROUTES
app.get("/", (req, res) => {
  res.send("FIRST POINT OF PROJECT OVER THE PORT NO - " + PORT);
});

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/users", projectRoutes);
app.use("/api/v1/users", noteRoutes);
app.use("/api/v1/users", taskRoutes);

// app.listen(PORT, () => {
//   console.log(`Yo the server is up and running over port: ${PORT}`);
// });

// Starting Server Only When DB Is Connected
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
  })
  .catch((err) => {
    console.error("Mongodb connection error", err);
    process.exit(1);
  });
