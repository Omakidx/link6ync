import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";
import adminRouter from "./routes/admin.routes";

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://link6ync.app",
  credentials: true, // Allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("trust proxy", 1); // Trust first proxy if behind a proxy (e.g., Heroku, Nginx)

// DEBUG: Log incoming origin for CORS troubleshooting
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`[CORS DEBUG] Incoming request from origin: ${origin}`);
  console.log(`[CORS DEBUG] Allowed Frontend URL: ${process.env.FRONTEND_URL}`);
  next();
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy!", timestamp: new Date().toISOString() });
});

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
