const userModel  = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {forgetMail} = require('../utils/mailTemplates')
const sendEmail = require('../middlewares/mail')

const resetPassword = async (req, res) => {
  try {
      const { token } = req.params;
      const { newPassword, confirmNewPassword } = req.body;

      // Verify the user's token
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      // Get the user's Id from the token
      const userId = decodedToken.userId;

      // Find the user by ID
      const user = await userModel.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Check if the new password matches the confirmation
      if (newPassword !== confirmNewPassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, saltedRound);

      // Update the user's password
      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
      console.error("Something went wrong", error.message);
      return res.status(500).json({ message: "Internal server error" });
  }
};


  const changePassword = async (req, res) => {
    try {
      const { token } = req.params;
      const {NewPassword, currentPassword } = req.body;
  
      // Verify the user's token
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

      // Get the user's Id from the token
      const userId = decodedToken.userId;
  
      // Find the user by ID
      const user = await userModel.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
  
      // Confirm the previous password
      const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({
          message: "Existing password does not match"
        });
      }
  
      // Salt and hash the new password
      const saltedRound = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(NewPassword, saltedRound);
  
      // Update the user's password
      user.password = hashedPassword;
      await user.save();
  
      res.status(200).json({
        message: "Password changed successful"
      });
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({
        message: error.message
      });
    }
  }
  

  const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
  
      // Check if the email exists in the userModel
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (user.deactivate === true) {
        return res.status(400).json({ message: 'User Account not valid' });
      }
  
      // Generate a reset token
      const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "20m" });
      const link = `https://www.naxtro-investmentfirm.com/reset_password/${token}`;
  
      const forgetHtml = forgetMail(link);
      const mailOptions = {
        from: process.env.user,
        to: user.email, // Corrected to use "to" instead of "email"
        subject: "Password Reset",
        html: forgetHtml
      };
  
      
      // Use nodemailer to send the email...
      await sendEmail(mailOptions);
  
      res.status(200).json({ message: "Password reset email sent successfully", token});
    } catch (error) {
      console.error("Something went wrong", error.message);
      res.status(500).json({ message: error.message });
    }
  };



  module.exports= {
    resetPassword,
    changePassword,
    forgotPassword
  }
  