import express, { Router } from 'express';
import {setSalary, updateSalary, getAllSalaries, getMySalary} from '../controllers/salary.controller.js';
import {verifyToken, authorizeRoles} from '../middlewares/auth.middleware.js';
const salaryRouter = express.Router();

salaryRouter.post("/set-salary", verifyToken, authorizeRoles("admin"), setSalary );
salaryRouter.put("/update-salary", verifyToken, authorizeRoles("admin"), updateSalary );
salaryRouter.get("/get-salary", verifyToken, authorizeRoles("admin"), getAllSalaries );
salaryRouter.get("/my-salary", verifyToken, authorizeRoles("employee"), getMySalary );
export default salaryRouter;