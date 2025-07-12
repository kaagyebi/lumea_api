import express from "express";
import mongoose from "mongoose";
import 'dotenv/config'
import cors from "cors";

import { connectDB } from "./config/db.js";
import { authRouter } from "./routes/auth_routes.js";
import { userRouter } from "./routes/user_routes.js";
import { appointmentRouter } from "./routes/appointment_routes.js";
import { cosmetologistRouter } from "./routes/cosmetologist_routes.js";
import { recommendationRouter } from "./routes/recommendation_routes.js";
import { skinReportRouter } from "./routes/skinreport_routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test endpoint to check if server is working
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working!", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/cosmetologist", cosmetologistRouter);
app.use("/api/recommendations", recommendationRouter);
app.use("/api/skin-reports", skinReportRouter);

await connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});