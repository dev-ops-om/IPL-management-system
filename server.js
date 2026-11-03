import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  // Connect to the DB first then start listening
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🏏 IPL Management Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
