import express from 'express';

import upload from '../middlewares/multer.js';
import authUser from '../middlewares/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/get-profile", authUser, getProfile)


export default userRouter;