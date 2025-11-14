import express, { Router } from 'express';
import {createEmployee, getEmployee, updateEmployee, permanentlyDeleteEmployee, softDeleteEmployee,RestoreEmployee, getTotalEmployees } from '../controllers/employee.controller.js';
import {verifyToken, authorizeRoles} from '../middlewares/auth.middleware.js';
const employeeRouter = express.Router();

employeeRouter.post("/create-employee", verifyToken, authorizeRoles("admin"), createEmployee);
employeeRouter.get("/get-employee/", verifyToken, authorizeRoles("admin", "employee"), getEmployee);
employeeRouter.put("/update-employee/:id", verifyToken, authorizeRoles("admin"), updateEmployee);
employeeRouter.patch("/soft-delete/:id", verifyToken, authorizeRoles("admin"), softDeleteEmployee);
employeeRouter.patch("/restore/:id", verifyToken, authorizeRoles("admin"), RestoreEmployee);
employeeRouter.delete("/permanent-delete/:id", verifyToken, authorizeRoles("admin"), permanentlyDeleteEmployee);
employeeRouter.get("/employeecount", verifyToken, authorizeRoles("admin"), getTotalEmployees );
export default employeeRouter;