<<<<<<< HEAD
import jwt from 'jsonwebtoken';


const authUser = async (req, res, next) => {
  try {
   
    let token = req.headers?.token;
    if (!token && req.headers?.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.log('Unauthorized access - no token');
      return res.status(401).json({
        success: false,
        message: 'Unauthorized access!!',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.userId = decoded.userId;

    return next();
  } catch (error) {
    console.log('Error in authUser', error?.message || error);
    return res.status(401).json({
      success: false,
      message: `Error occured in authUser function: ${error?.message || error}`,
    });
  }
=======
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;
        
        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Please login again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
>>>>>>> 9230d90d112e286ef899c28b668eff58b767a380
};

export default authUser;
