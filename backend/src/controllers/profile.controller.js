import User from "../models/user.model.js";
import fs from "fs";
import mongoose from "mongoose";
import NodeCache from "node-cache";

// 60 seconds TTL for profile cache
const cache = new NodeCache({ stdTTL: 60 });

//  Flush profile cache helper
export const flushProfileCache = (userId) => {
  if (userId) cache.del(`profile_${userId}`);
  else cache.flushAll();
};

// GET Employee Profile
export const getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `profile_${userId}`;

    const cachedProfile = cache.get(cacheKey);
    if (cachedProfile) return res.json({ success: true, data: cachedProfile, cached: true });

    const employee = await User.findById(userId).populate("departments", "name");
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    const profileData = {
      name: employee.name,
      email: employee.email,
      profileImage: employee.profileImage,
      salary: employee.salary,
      role: employee.role,
      departments: employee.departments.map(dep => dep.name),
    };

    cache.set(cacheKey, profileData);
    res.json({ success: true, data: profileData, cached: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE Employee Profile
export const updateEmployeeProfile = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const employee = await User.findById(userId).session(session);
    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Employee not found" });
    }

    let updateData = {};

    //  Update name
    if (req.body.name) updateData.name = req.body.name;

    //  Update profile image
    if (req.file) {
      // Delete old image
      if (employee.profileImage) {
        const oldPath = "." + employee.profileImage;
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.profileImage = "/uploads/" + req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, session }
    );

    //  Flush cache
    flushProfileCache(userId);

    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        name: updatedUser.name,
        profileImage: updatedUser.profileImage + "?t=" + Date.now(),
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
