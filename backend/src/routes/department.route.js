import express, {Router} from 'express';
import { createDepartment, updateDepartment, deleteDepartment, getDepartment } from '../controllers/department.controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const departmentRouter = express.Router();
departmentRouter.post("/create-department", verifyToken, authorizeRoles("admin"), createDepartment);
departmentRouter.put("/update-department/:id", verifyToken, authorizeRoles("admin"), updateDepartment);
departmentRouter.get('/get-department', verifyToken, authorizeRoles("admin"), getDepartment);
departmentRouter.delete('/delete-department/:id', verifyToken, authorizeRoles("admin"), deleteDepartment);

export default departmentRouter;