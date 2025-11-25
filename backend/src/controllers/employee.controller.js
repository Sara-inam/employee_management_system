import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import logger from "../config/logger.js";
import mongoose from "mongoose";
import NodeCache from "node-cache";

//create in memory cache for 60 seconds
const cache = new NodeCache({stdTTL: 60});


// GET Employees (read only, no session needed)
export const getEmployee = async (req, res) => {
  try {


    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit)|| 10;
    const loggedInUserRole = req.user.role;
    const skip = (page-1) * limit;
    let query = { role: "employee" };
    let users;

    //cache key
    const cacheKey = `employees_page_${page}_limit_${limit}`;
    const cachedData = cache.get(cacheKey);
    if(cachedData){
      logger.info("Returnning Employees from cache");
      return res.status(200).json(cachedData);
    }

    if (loggedInUserRole === "admin") {
      users = await User.find(query).select("-password").skip(skip).limit(limit);
    } else if (loggedInUserRole === "employee") {
      users = await User.find(query).select("-password -createdAt -updatedAt").skip(skip).limit(limit);
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

     const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
//pagination 
    const response = {
      users,
      pagination: {
        totalRecords: total,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
// store in cache
    cache.set(cacheKey, response);
    logger.info("Employee stored in cache");
    res.status(200).json(response);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//helper function: flush cache
const flushEmployeeCache = ()=>{
  cache.flushAll();
  logger.info("employee cache flush");
};

// CREATE Employee with session
export const createEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password, role, profileImage } = req.body;

    const existing = await User.findOne({ email }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newEmployee = new User({
      name,
      email,
      password: hashPassword,
      role,
      profileImage: profileImage || null,
    });

    await newEmployee.save({ session });
    await session.commitTransaction();
    session.endSession();

    //flush function call
    flushEmployeeCache();

<<<<<<< HEAD
    res.status(200).json({ message: "Employee created successfully" });
=======
    res.status(201).json({ message: "Employee created successfully" });
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE Employee with session
export const updateEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { name, email, password, profileImage } = req.body;

    const employee = await User.findById(id).session(session);
    if (!employee) {
      await session.abortTransaction();
      session.endSession();
<<<<<<< HEAD
      return res.status(400).json({ message: "Employee not found" });
=======
      return res.status(404).json({ message: "Employee not found" });
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
    }

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (password) employee.password = await bcrypt.hash(password, 10);
    if (profileImage) employee.profileImage = profileImage;

    await employee.save({ session });
    await session.commitTransaction();
    session.endSession();

    //invalidate cache
    flushEmployeeCache();

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// PERMANENT DELETE Employee with session
export const permanentlyDeleteEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Employee ID is required" });
    }

    const deletedEmployee = await User.findByIdAndDelete(id, { session });
    if (!deletedEmployee) {
      await session.abortTransaction();
      session.endSession();
<<<<<<< HEAD
      return res.status(400).json({ message: "Employee not found" });
=======
      return res.status(404).json({ message: "Employee not found" });
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
    }

    await session.commitTransaction();
    session.endSession();

    //invalidatye cache
    flushEmployeeCache();
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET Total Employees (read only, no session)
export const getTotalEmployees = async (req, res) => {
  try {
    const cacheKey = "totalEmployees";
    const cachedData = cache.get(cacheKey);
    
    if (cachedData){
      logger.info("Returning total employee from cache");
      return res.status(200).json({totalEmployees: cachedData});
    }
    const count = await User.countDocuments({ role: "employee" });

    cache.set(cacheKey, count);
    logger.info("Total Employee Stored in Cache");
    res.status(200).json({ totalEmployees: count });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// SOFT DELETE Employee with session
export const softDeleteEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const deletedBy = req.user?.email || "admin";

    const employee = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: deletedBy,
      },
      { new: true, session }
    );

    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Employee not found" });
    }

    await session.commitTransaction();
    session.endSession();

    //invalidate cache
    flushEmployeeCache();

    res.status(200).json({ message: "Employee soft deleted successfully", employee });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// RESTORE Employee with session
export const RestoreEmployee = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const employee = await User.findByIdAndUpdate(
      id,
      {
        isDeleted: false,
        deletedAt: null,
        deletedBy: null,
      },
      { new: true, session }
    );

    if (!employee) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Employee not found" });
    }

    await session.commitTransaction();
    session.endSession();

    //invalidate cache
    flushEmployeeCache();
    
    res.status(200).json({ message: "Employee restored successfully", employee });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
<<<<<<< HEAD
export const getAllEmployees = async (req, res) => {
  try {
    // sirf active employees aur required fields
    const employees = await User.find({ role: "employee", isDeleted: false }).select("_id name");
    res.status(200).json({ employees });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
=======
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
