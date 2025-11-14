import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "./config.js";
import User from "./src/models/user.model.js";
import logger from "./src/config/logger.js";

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    const hashedPassword = await bcrypt.hash("123456", 10);

    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (adminExists) {
      logger.info("Admin already exists!");
      return;
    }

    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    logger.info("✅ Admin user created successfully!");
    mongoose.connection.close();
  } catch (error) {
    logger.error("❌ Error:", error.message);
    mongoose.connection.close();
  }
};

seedAdmin();
