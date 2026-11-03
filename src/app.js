import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";

import ApiResponse from "./common/utils/api-response.js";
import ApiError from "./common/utils/api-error.js";
import authRoutes from "./module/auth/auth.routes.js";
import ownerRoutes from "./module/ipl_ms/routes/owner.routes.js";
import teamRoutes from "./module/ipl_ms/routes/team.routes.js";
import playerRoutes from "./module/ipl_ms/routes/player.routes.js";
import sponsorRoutes from "./module/ipl_ms/routes/sponsor.routes.js";
import broadcasterRoutes from "./module/ipl_ms/routes/broadcaster.routes.js";
import matchRoutes from "./module/ipl_ms/routes/match.routes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get("/health", (req, res) => {
  return ApiResponse.ok(res, "Server is healthy!", { uptime: process.uptime() });
});

app.use("/api/auth", authRoutes);
app.use("/api/owners", ownerRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/players", playerRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/broadcasters", broadcasterRoutes);
app.use("/api/matches", matchRoutes);

app.use((req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
