import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee", require: true },
    profileImage: { type: String },

    // Many-to-Many: Employee to Departments
    departments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        }
    ],
    salary: {
        type: Number,
        required: true
     },

    // Soft Delete
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
    deletedBy: { type: String, default: null },

    resetPasswordToken: String,
    resetPasswordExpiry: Date,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
