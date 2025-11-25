import express, { Router } from 'express';
import {createEmployee, getEmployee, updateEmployee, permanentlyDeleteEmployee, softDeleteEmployee,getAllEmployees, RestoreEmployee, getTotalEmployees } from '../controllers/employee.controller.js';
import {verifyToken, authorizeRoles} from '../middlewares/auth.middleware.js';
import User from '../models/user.model.js';
const employeeRouter = express.Router();

employeeRouter.post("/create-employee", verifyToken, authorizeRoles("admin"), createEmployee);
employeeRouter.get("/get-employee", verifyToken, authorizeRoles("admin", "employee"), getEmployee);
employeeRouter.put("/update-employee/:id", verifyToken, authorizeRoles("admin"), updateEmployee);
employeeRouter.patch("/soft-delete/:id", verifyToken, authorizeRoles("admin"), softDeleteEmployee);
employeeRouter.patch("/restore/:id", verifyToken, authorizeRoles("admin"), RestoreEmployee);
employeeRouter.delete("/permanent-delete/:id", verifyToken, authorizeRoles("admin"), permanentlyDeleteEmployee);
employeeRouter.get("/employeecount", verifyToken, authorizeRoles("admin"), getTotalEmployees );
employeeRouter.get("/get-all", verifyToken, authorizeRoles("admin"), getAllEmployees);
employeeRouter.get('/search', async (req, res) => {
  try {
    const query = req.query.query || '';
    const employees = await User.find({ 
      role: "employee",
      name: { $regex: query, $options: 'i' } 
    }).limit(50);

    res.status(200).json({ employees });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default employeeRouter;