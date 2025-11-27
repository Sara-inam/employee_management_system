import express from "express";
import cors from "cors";
import config from "./config.js";
import connectdb from "./src/db/db.js";
import logger from "./src/config/logger.js";
import app from "./src/app.js";

const server = express();

server.use(cors({ origin: "http://localhost:5173", credentials: true }));
server.use(express.json());

server.use("/api", app);

const startServer = async () => {
  try {
    await connectdb();
    const PORT = config.PORT || 5000;
    server.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
};

startServer();
