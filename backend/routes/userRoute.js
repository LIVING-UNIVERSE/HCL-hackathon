import express from 'express';
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/authController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authUser, getProfile);
userRouter.put("/profile", authUser, updateProfile);

export default userRouter;