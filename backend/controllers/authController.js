import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from 'validator'

import userModel from "../models/userModel.js";


// API to register users

const registerUser = async (req,res)=>{
    try {

        const { name, email, password, phone, addressLine1, addressLine2, address } = req.body;

        if(!name || !email || !password){
            return res.json({
                success:"false",
                message: "missing details",
            })
        }

        if(!validator.isEmail(email)){
            res.send({
                success:"false",
                message:"Please enter correct email!",
            })
        }

        if(password.length <8){
            res.send({
                success:"false",
                message:"Please enter a strong password!",
            })
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        const addressPayload = {
            line1: address?.line1 ?? addressLine1,
            line2: address?.line2 ?? addressLine2,
        }

        const userData ={
            name,
            email,
            password:hashedPassword,
        }

        if (phone) {
            userData.phone = phone;
        }

        if (addressPayload.line1 || addressPayload.line2) {
            userData.address = addressPayload;
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })
        
    } catch (error) {
        console.log(error);
        res.send({
            success:"false",
            message:error.message,
        })
    }
}



// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json(
                { success: false, 
                  message: "User does not exist",
                }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, phone, addressLine1, addressLine2, address } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        
        const addressPayload = {
            line1: address?.line1 ?? addressLine1,
            line2: address?.line2 ?? addressLine2,
        };

        if (addressPayload.line1 || addressPayload.line2) {
            updateData.address = addressPayload;
        }

        const userData = await userModel.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

        res.json({ success: true, message: "Profile updated successfully", userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
}