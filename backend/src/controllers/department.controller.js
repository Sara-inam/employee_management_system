import Department from '../models/department.model.js';
import logger from '../config/logger.js';
import mongoose from 'mongoose';
import NodeCache from "node-cache";

//create in memory cache for 60 seconds
const cache = new NodeCache({stdTTL: 60});

export const createDepartment = async (req, res) =>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try{
        const {name, discription, head} = req.body;
        const existingDepart = await Department.findOne({name}).session(session);
        if (existingDepart) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: "Department name already exist."});
        }
        const newDepartment = new Department({
            name,
            discription,
            head: head || null,
        });
         await newDepartment.save({session});
         await session.commitTransaction();
         session.endSession();
         flushDepartmentCache();
         res.status(200).json({message: "Department created successfully"});
    }catch(error){
        await  session.abortTransaction();
        session.endSession();
        logger.error(error.message);
        res.status(500).json({message: "Internal Server Error"});

    }
};

export const updateDepartment = async (req, res) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {id} = req.params;
        const {name, discription, head} = req.body;
        const department = await Department.findById(id).session(session);
        if(!department){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ message: "Department not found"});
        }
        if (name) department.name = name;
        if (discription) department.discription = discription;
        if (head) department.head = head;

        await department.save({session});
        await session.commitTransaction();
        session.endSession();
        flushDepartmentCache();

        res.status(200).json({message: "Department updated successfully."});

    }catch(error){
        await session.abortTransaction();
        session.endSession();
        logger.error(error.message);
        req.status(500).json({message: "Internal Server Error"});
    }
};

export const deleteDepartment = async (req, res) =>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {id} = req.params;
        if(!id) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: "Department Id is required"});

        }
        const deletedDepartment = await Department.findByIdAndDelete(id, {session});
        if(!deletedDepartment){
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({message: "Department not found"});

        }
        await session.commitTransaction();
        session.endSession();
        flushDepartmentCache();
        
        res.status(200).json({ message: "Department deleted successfully."});
    }catch(error){
        await session.abortTransaction();
        session.endSession();
        logger.error(error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};
export const getDepartment = async (req, res) => {
    try {
        
        const cachedDepartments = cache.get("departments");
        if (cachedDepartments) {
           
            return res.status(200).json({
                message: "Departments fetched successfully (from cache).",
                departments: cachedDepartments,
            });
        }

      
        const department = await Department.find().populate("head", "name email");

        if (!department || department.length === 0) {
            return res.status(400).json({ message: "No departments found" });
        }

      
        cache.set("departments", department);

        
        return res.status(200).json({
            message: "Departments fetched successfully.",
            departments: department,
        });

    } catch (error) {
        logger.error(error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const flushDepartmentCache = ()=>{
  cache.flushAll();
  
};
