import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: {
        line1: { type: String, trim: true },
        line2: { type: String, trim: true },
    },
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;