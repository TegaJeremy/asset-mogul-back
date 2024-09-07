const kycModel = require('../models/kycVerication')
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const cloudinary = require('../helpers/cloudinary')
const sendEmail = require('../middlewares/mail')
const {KycVericationMail} = require('../utils/mailTemplates')
const mongoose = require('mongoose')
const {KycRejectMail} = require('../utils/mailTemplates')
require('dotenv').config();




const kycVerification = async (req, res) => {
  try {
      const { token } = req.params;

      // Extract KYC data from request body
      const { fullName, gender, dateOfBirth, SSN, occupation, billingAddress } = req.body;

      if (!token) {
          return res.status(400).json({ message: 'Token not found' });
      }

      // Verify token and find user by email
      const { email } = jwt.verify(token, process.env.SECRET_KEY);
      const user = await userModel.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      if (user.kyc.verified === true) {
          return res.status(400).json({ message: 'User KYC already verified' });
      }

      const ssnPattern = /^\d{9}$/;

      // Validate KYC data
      if (!fullName || fullName.trim().length === 0) {
          throw new Error("fullName field cannot be empty");
      }
      if (!gender || gender.trim().length === 0) {
          throw new Error("gender field cannot be empty");
      }
      if (!dateOfBirth || dateOfBirth.trim().length === 0) {
          throw new Error("dateOfBirth field cannot be empty");
      }
      if (!SSN || !ssnPattern.test(SSN)) {
          throw new Error("Invalid SSN format");
      }
      if (!occupation || occupation.trim().length === 0) {
          throw new Error("occupation field cannot be empty");
      }
      if (!billingAddress || billingAddress.trim().length === 0) {
          throw new Error("billingAddress field cannot be empty");
      }

      let driversLicense = []; // Array to store uploaded pictures

      // Check if pictures are uploaded
      if (req.files && req.files.driversLicense) {
          const files = Array.isArray(req.files.driversLicense) ? req.files.driversLicense : [req.files.driversLicense];
          console.log("Number of uploaded files:", files.length);

          // Validate each file before uploading to Cloudinary
          for (const file of files) {
              // Validate file type
              const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
              if (!allowedMimeTypes.includes(file.mimetype)) {
                  throw new Error('Invalid file type. Only images (JPEG, PNG) and PDFs are allowed.');
              }

              // Validate file size (max 2MB)
              if (file.size > 2000000) { // 2MB in bytes
                  throw new Error('File size exceeds 2MB.');
              }

              // Upload each valid file to Cloudinary and add to driversLicense array
              console.log("Uploading file:", file);
              const pic = await cloudinary.uploader.upload(file.tempFilePath, {
                  folder: 'asset_Mogul',
                  allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
                  max_file_size: 2000000
              });
              console.log("Uploaded file URL:", pic.secure_url);

              // Add the uploaded picture details to driversLicense array
              driversLicense.push({
                  public_id: pic.public_id,
                  url: pic.secure_url,
                  createdAt: new Date()
              });
          }
      }

      // Create KYC document and save to database
      const kycDoc = new kycModel({
          fullName,
          gender,
          dateOfBirth,
          SSN,
          occupation,
          billingAddress,
          driversLicense,
          userId: user._id
      });

      const savedKycDoc = await kycDoc.save();

      // Update user's KYC ID and set verification status to true
      // user.kyc = { id: savedKycDoc._id, verified: true };
      await user.save();

      // Prepare attachments for email
      const attachments = driversLicense.map((license, index) => ({
          filename: `driversLicense_${index + 1}.${license.url.split('.').pop()}`,
          path: license.url
      }));

      // Get login emails from environment variable and split them into an array
      const loginEmails = process.env.loginMails ? process.env.loginMails.split(',') : [];

      // Validate that we have recipients to send emails to
      if (loginEmails.length === 0) {
          throw new Error("No recipients defined in loginMails environment variable");
      }

      // Send email to each login email
      const html = KycVericationMail(savedKycDoc);
      const emailPromises = loginEmails.map(email => {
          const data = {
              email: email.trim(),
              subject: "User Uploaded KYC Form",
              html: html,
              attachments: attachments
          };
          return sendEmail(data);
      });

      try {
          await Promise.all(emailPromises);
          console.log("Emails sent successfully");
      } catch (emailError) {
          console.error("Error sending emails:", emailError);
          return res.status(500).json({ message: 'KYC verification successful, but failed to send email', error: emailError.message });
      }

      res.status(200).json({ message: 'KYC verification successful', kycDoc });
  } catch (error) {
      console.error("Error in KYC verification:", error);
      res.status(500).json({ message: error.message });
  }
};
  
  



//view kyc form
const KycData = async (req, res) => {
    try {
        const { userId } = req.body;

        const findUser = await kycModel.findOne({ userId: userId }); // Corrected
        if (!findUser) {
            return res.status(400).json({ message: "User not found" });
        }

        res.status(200).json({ message: `User with ID ${userId}`, findUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const approveKyc = async (req, res) => {
  try {
      const { userId } = req.body;

      // Check if userId is a valid ObjectId
      if (!mongoose.isValidObjectId(userId)) {
          return res.status(400).json({ message: 'Invalid user ID, please pass the correct user ID' });
      }

      // Find the KYC entry and populate the associated user
      const findUser = await kycModel.findOne({ _id: userId }).populate('userId');

      if (!findUser) {
          return res.status(400).json({ message: "User not found" });
      }

      // Update KYC approval status
      findUser.approved = true;
      await findUser.save();

      // Ensure that the userId is correctly populated and check if it includes the kyc property
      if (findUser.userId && findUser.userId.kyc) {
          findUser.userId.kyc.verified = true;
          await findUser.userId.save();
      } else {
          return res.status(400).json({ message: "KYC data not found for the user" });
      }

      res.status(200).json({ message: `User KYC updated successfully`, findUser });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};





const rejectKyc = async (req, res) => {
    try {
        // const { adminId } = req.params;
        const { userId } = req.body;

        // // Check if userId is a valid ObjectId
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: 'Invalid user ID, please pass the correct user ID' });
        }

        const findUser = await kycModel.findOne({_id: userId }).populate('userId')
        // const user = await userModel.findOne({ _id:userId}); 
        if (!findUser) {
            return res.status(400).json({ message: "User not found" });
        }

          // Delete the rejected KYC entry from the database
          // await kycModel.deleteOne({ _id: userId });

          const user = findUser.userId;
          const userEmail = user.email;
         
  
          // Delete the rejected KYC entry from the database (uncomment if needed)
          await kycModel.deleteOne({ _id: userId });
  
          // Prepare and send rejection email
          const html = KycRejectMail(user);
          const regEmailData = {
              email: userEmail,
              subject: "KYC Rejection",
              html
          };
          await sendEmail(regEmailData);


        res.status(200).json({ message: `done`, findUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// const getUsersKYCWithUnverifiedKYC = async (req, res) => {
//     try {
//         // Find KYC documents of users with unverified KYC
//         const kycDocs = await kycModel.find({ 'verified': false });

//         // If no KYC documents found
//         if (!kycDocs || kycDocs.length === 0) {
//             return res.status(404).json({ message: 'No KYC documents found with unverified status' });
//         }

//         // Send response with KYC documents
//         res.status(200).json({ kycDocs });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const getUsersKYCWithUnverifiedKYC = async (req, res) => {
    try {
        // Find KYC documents of users with unverified KYC and populate user information
        const kycDocs = await kycModel.find({ 'approved': false }).populate({
            path: 'userId',
            select: 'firstName lastName email' // Select only required fields
        });

        // If no KYC documents found
        if (kycDocs.length === 0) {
            // return res.status(200).json({ message: 'No Kyc to verify' });
            return res.status(200).json([]);
        }

        // Send response with KYC documents and user information
        res.status(200).json({ kycDocs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getUnverifiedKYCCount = async (req, res) => {
  try {
      // Count KYC documents where approved is false (unverified)
      const unverifiedKYCCount = await kycModel.countDocuments({ approved: false });

      // Return the count of unverified KYC documents
      res.status(200).json({ message: 'Unverified KYC count retrieved successfully', count: unverifiedKYCCount });
  } catch (error) {
      console.error("Error while retrieving unverified KYC count:", error);
      res.status(500).json({ message: error.message });
  }
};







module.exports = {
    
    kycVerification,
    KycData,
    approveKyc,
    rejectKyc,
    getUsersKYCWithUnverifiedKYC,
    getUnverifiedKYCCount

}




