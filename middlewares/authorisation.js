const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(403).json({
      message: 'No Authorization Header Found. Please log in.',
    });
  }
  

  const token = authorizationHeader.split(' ')[1];
  
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

    if (decodedToken.isLoggedIn !== true) {
      return res.status(401).json({ message: 'User is not logged in. Please log in to continue.' });
    }

    // Check if the token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      // Token has expired, set isLoggedIn to false
      await userModel.findOneAndUpdate({ email: decodedToken.email }, { isLoggedIn: false });
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }

    // Fetch the user from the database
    const user = await userModel.findOne({ email: decodedToken.email });

    if (!user) {
      return res.status(401).json({
        message: 'User not found.',
      });
    }

    // Attach the user information to the request for future use
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(500).json(error.message);
  }
};



const Role = async (req,res,next)=>{
  try {
    if(req.user.isAdmin === true){
      next()
    }else{
      res.status(401).json({message:'you are not allowed to perform this function'})
    }
    
  } catch (error) {
    res.status(500).json({message:error.message})
  }
}




module.exports ={ authenticateUser, Role}
