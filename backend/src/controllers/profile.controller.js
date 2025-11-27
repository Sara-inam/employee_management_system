import User from "../models/user.model.js";
import fs from "fs";
import mongoose from "mongoose";


const userCache = {}; 

export const getEmployeeProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (userCache[userId]) {
            return res.json({ success: true, data: userCache[userId], cached: true });
        }

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

        userCache[userId] = profileData;

        res.json({ success: true, data: profileData, cached: false });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};

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
    
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.file) updateData.profileImage = "/uploads/" + req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, session }
    );

    // Clear cache
    if (userCache[userId]) delete userCache[userId];

    await session.commitTransaction();
    session.endSession();

    res.json({ success: true, message: "Profile updated successfully", data: {
      name: updatedUser.name,
      profileImage: updatedUser.profileImage
    } });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};