import nodemailer from 'nodemailer';
import config from '../../config.js';
import dotenv from 'dotenv';
import logger from '../config/logger.js';
dotenv.config();
export const sendEmail = async ({to, subject, html})=>{
    try{
        const transporter = nodemailer.createTransport({
            service: config.EMAIL_SERVICE,
            auth:{
                user: config.EMAIL_USER,
                pass: config.EMAIL_PASS
            }
        });
        const info = await transporter.sendMail({
            from: `"EMS SUPPORT" <${config.EMAIL_USER}>`,
            to, 
            subject,
            html
        });
        logger.info("Email sent successfully:",info.messageId);
        return info;

    }catch(error){
        logger.error("Error sending email:", error);
        throw error;
    }
};