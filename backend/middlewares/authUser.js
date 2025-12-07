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
};

export default authUser;
