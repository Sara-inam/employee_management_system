import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import logger from "../config/logger.js";
import config from "../../config.js";
import { validateUserFields, validateForgetPassword, validateResetPassword } from "../validators/auth.validator.js";
import { sendEmail } from "../utilis/sendEmail.js";


export const authLogin = async (req, res) => {
  try {
   
    const errors = validateUserFields(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.EXPIRE_IN || "7d" }
    );


    res.status(200).json({
      message: `${user.role} login successful`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      
      },
      token,
    });

    logger.info(`${user.role} logged in: ${user.email}`);

  } catch (error) {
    console.log("Error:", error); 
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const forgetPassword = async(req, res)=>{
  try{
    const errors = validateForgetPassword(req.body);
    if(errors.length > 0){
      return res.status(400).json({errors});
      
    }
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
      res.status(404).json({message: "User not found"});
    }
    const resetToken = jwt.sign(
      {id: user._id},
      config.JWT_SECRET,
      { expiresIn: "15m" } 
    );
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;  //15 min
    await user.save();
   const resetLink = `${config.FRONTEND_URL}/reset-password/${encodeURIComponent(resetToken)}`;

    
    const html = `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. It will expire in 15 minutes.</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>If you didn't request this, ignore the email.</p>
    `;

    await sendEmail({
      to: email,
      subject: "EMS - Password Reset Link",
      html
    });

    return res.status(200).json({ message: "Password reset link sent to your email" });

  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const cleanToken = decodeURIComponent(token.trim());
    const { password, confirmPassword } = req.body;

    const errors = validateResetPassword({ password, confirmPassword });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const user = await User.findOne({
      resetPasswordToken: cleanToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};