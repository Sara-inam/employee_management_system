import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    discription: {
  type: String,
  default: "",
},
    head:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,

    },
});
export default mongoose.model("Department", departmentSchema);