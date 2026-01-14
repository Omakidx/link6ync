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
// Custom CORS origin handler for detailed debugging
const allowedOrigins = [
  process.env.FRONTEND_URL || "https://link6ync.app",
  "https://www.link6ync.app",
  "https://link6ync.app"
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log("[CORS] Allowing no-origin request");
      return callback(null, true);
    }

    console.log(`[CORS] Checking origin: '${origin}'`);

    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS] ALLOWED origin: '${origin}'`);
      return callback(null, true);
    } else {
      console.error(`[CORS] BLOCKED origin: '${origin}'`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.set("trust proxy", 1); 

// Request Logger
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
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
