import mongoose from 'mongoose';
import User from '../models/user.model.js';
const salarySchema = new mongoose.Schema({
    employeeId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
     },
     amount: {
        type: Number,
        required: true
     },
     month: {
        type: String,
        required: true
     }, 
     year: {
        type: String, 
        required: true
     }
}, {timestamps: true});
const Salary = mongoose.model("Salary", salarySchema);
export default Salary;