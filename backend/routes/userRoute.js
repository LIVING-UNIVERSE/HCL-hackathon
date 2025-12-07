import express from 'express';
<<<<<<< HEAD

import { registerUser,loginUser,getProfile } from '../controllers/authController.js';

=======
import { registerUser, loginUser, getProfile, updateProfile } from '../controllers/authController.js';
>>>>>>> 9230d90d112e286ef899c28b668eff58b767a380
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authUser, getProfile);
userRouter.put("/profile", authUser, updateProfile);

export default userRouter;