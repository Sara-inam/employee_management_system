import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {type: String, require: true},
    email: {type: String, require: true},
    password: {type: String, require: true},
    role: {type: String, enum: ["admin", "employee"], default: "employee", require: true},
    profileImage: {type: String},
     //Soft Delete
    isDeleted: {type: Boolean, default: false},
    deletedAt: {type: Date, default: null},
    deletedBy: {type: String, Default: null},
    resetPasswordToken: String,
    resetPasswordExpiry: Date,
   

<<<<<<< HEAD
}, {timestamps: true});
=======
}, {timestamps: true})
>>>>>>> 3b42cf460f530e5d6abe945295f443b0016e3994
const User = mongoose.model("User", userSchema)
export default User