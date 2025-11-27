import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getEmployeeProfile, updateEmployeeProfile } from "../controllers/profile.controller.js";
import upload from "../middlewares/upload.middleware.js";
const profileRouter = express.Router();

profileRouter.get("/profile", verifyToken, getEmployeeProfile);
profileRouter.put(
  "/update",
  verifyToken,
  upload.single("profileImage"), 
  updateEmployeeProfile
);
export default profileRouter;
