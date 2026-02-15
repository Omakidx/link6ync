import app from "./app";
import { connectDB } from "./configs/db";
import http from "http";
import dotenv from "dotenv";
dotenv.config();

const startServer = async () => {
  await connectDB();
  // Additional server setup code can go here
  const server = http.createServer(app);

  server.listen(process.env.PORT || 5000, () => {
    console.log(`server is now starting on PORT ${process.env.PORT}`);
    console.log(`[CORS DEBUG] Configured FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  });
};

startServer().catch(() => {
  console.error("Failed to start the server");
  process.exit(1);
});
