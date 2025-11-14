import express, { Router } from 'express';
import { authLogin, forgetPassword, resetPassword  } from '../controllers/auth.controller.js';
import {verifyToken, authorizeRoles} from '../middlewares/auth.middleware.js';
const authRouter = express.Router();


authRouter.post("/login", authLogin );
authRouter.post("/forget-password", forgetPassword );
authRouter.post("/reset-password/:token", resetPassword );



export default authRouter;