import Salary from "../models/salary.model.js";
import User from "../models/user.model.js";
import logger from "../config/logger.js";
import mongoose from "mongoose";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 60 }); // 60 seconds 



//helper function: flush cache
const flushEmployeeCache = ()=>{
  cache.flushAll();
  logger.info("employee cache flush");
};

//set salary by admin with session implemented
export const setSalary = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { employeeEmail, amount, month, year } = req.body;

   
    const employee = await User.findOne({ email: employeeEmail, role: "employee" });
    if (!employee) 
      return res.status(404).json({ message: "Employee not found" });

   
    const salaryExists = await Salary.findOne({ employeeId: employee._id, month, year });
    if (salaryExists) {
      return res.status(400).json({ message: `Salary for ${month}/${year} already exists. Use updateSalary to change it.` });
    }

    
    const salary = new Salary({
      employeeId: employee._id,
      employeeEmail: employee.email,
      amount,
      month,
      year,
    });

    await salary.save({session});
    await session.commitTransaction();
    flushEmployeeCache();
    res.status(200).json({ message: `Salary set successfully for ${employee.name} for ${month}/${year}`, salary });

  } catch (error) {
    await session.abortTransaction();
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }finally{
    session.endSession();
  }
};


//update salary by admin with session implemented
export const updateSalary = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { employeeEmail, amount, month, year } = req.body;

  
    const employee = await User.findOne({ email: employeeEmail, role: "employee" });
    if (!employee) 
      return res.status(404).json({ message: "Employee not found" });

   
    const salary = await Salary.findOne({ 
      employeeId: employee._id, 
      month, 
      year 
    });

    if (!salary) 
      return res.status(404).json({ message: `Salary not found for ${month}/${year}` });

   
    salary.amount = amount;
    await salary.save({session});
    
    await session.commitTransaction();

    flushEmployeeCache();

    res.status(200).json({ message: `Salary updated successfully for ${employee.name} for ${month}/${year}`, salary });

  } catch (error) {
    await session.abortTransaction();  
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }finally{
    session.endSession();
  }
};


//get employee salaries by admin 
<<<<<<< HEAD
// export const getAllSalaries = async (req, res) => {
//   try {
//     let page = parseInt(req.query.page) || 1;
//     let limit = parseInt(req.query.limit)|| 10;
//     const skip = (page-1) * limit;

    
//     const totalCount = await Salary.countDocuments(); // total salaries
//     const totalPages = Math.ceil(totalCount / limit);


//     const cacheKey = "allSalaries";
//     const cachedData = cache.get(cacheKey);
    
//     if(cachedData){
//       logger.info("Returning all salaries from cache");
//       return res.status(200).json({salaries: cachedData});
//     }
//     const salaries = await Salary.aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "employeeId",
//           foreignField: "_id",
//           as: "employeeInfo",
//         },
//       },
//       { $unwind: "$employeeInfo" },
//       {
//         $project: {
//           _id: 0,
//           name: "$employeeInfo.name",
//           email: "$employeeInfo.email",
//           amount: 1,
//           month: 1,
//           year: 1,
//         },
//       },
//       { $sort: { year: -1, month: -1 } }, // latest first
//       { $skip: skip },
//       { $limit: limit },
//     ]);
//     cache.set(cacheKey, salaries);
//     logger.info("All salaries stored in cache");
   
//     res.status(200).json({page, limit,   totalPages,  salaries });

//   } catch (error) {
//     logger.error(error.message);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };
export const getAllSalaries = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalCount = await Salary.countDocuments(); // total salaries
    const totalPages = Math.ceil(totalCount / limit);

=======
export const getAllSalaries = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit)|| 5;
    const skip = (page-1) * limit;


    const cacheKey = "allSalaries";
    const cachedData = cache.get(cacheKey);
    
    if(cachedData){
      logger.info("Returning all salaries from cache");
      return res.status(200).json({salaries: cachedData});
    }
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
    const salaries = await Salary.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "employeeId",
          foreignField: "_id",
          as: "employeeInfo",
        },
      },
      { $unwind: "$employeeInfo" },
      {
        $project: {
          _id: 0,
          name: "$employeeInfo.name",
          email: "$employeeInfo.email",
          amount: 1,
          month: 1,
          year: 1,
        },
      },
<<<<<<< HEAD
      { $sort: { year: -1, month: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    cache.set("allSalaries", salaries);

    res.status(200).json({ page, limit, totalPages, salaries });
=======
      { $sort: { year: -1, month: -1 } }, // latest first
      { $skip: skip },
      { $limit: limit },
    ]);
    cache.set(cacheKey, salaries);
    logger.info("All salaries stored in cache");
   
    res.status(200).json({page, limit, salaries });

>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// get My Salary fuction is implemented for employee
export const getMySalary = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
<<<<<<< HEAD
    let limit = parseInt(req.query.limit) || 10;
=======
    let limit = parseInt(req.query.limit) || 5;
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
    const skip = (page - 1) * limit;

    const cacheKey = `mySalary_${req.user._id}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      logger.info("Returning my salaries from cache ");
      return res.status(200).json({ salaries: cachedData });
    }
    const mySalaries = await Salary.find({ employeeId: req.user._id }).sort({ year: -1, month: -1 })
      .skip(skip)
      .limit(limit)
      .select("amount month year -_id");

      cache.set(cacheKey, mySalaries);
      logger.info("My Salaries stored in cache.");

    res.status(200).json({ page, limit, salaries: mySalaries });

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};
