// // Define a middleware function to check the cooldown period
// // const checkResendCooldown = async (req, res, next) => {
// //     try {
       

// //         // Check if the user has requested an OTP in the last 1 minute
// //         const cooldownDuration = 60000; // 1 minute in milliseconds
// //         const currentTime = Date.now();
// //         if (user.lastOtpRequest && (currentTime - user.lastOtpRequest) < cooldownDuration) {
// //             return res.status(400).json({ message: 'You can request OTP only once per minute' });
// //         }

// //         // Update the user's lastOtpRequest timestamp
// //         user.lastOtpRequest = currentTime;

// //         // Save the user
// //         await user.save();

// //         // Continue to the next middleware or route handler
// //         next();
// //     } catch (error) {
// //         console.error("Error in checkResendCooldown middleware:", error);
// //         res.status(500).json({ message: error.message });
// //     }
// // };
// // module.exports = checkResendCooldown



// const kycModel = require('../models/kycVerication')
// const userModel = require('../models/testin g')
// const jwt = require('jsonwebtoken')
// const cloudinary = require('../helpers/cloudinary')
// const sendEmail = require('../middlewares/mail')
// const {KycVericationMail} = require('../utils/mailTemplates')
// const mongoose = require('mongoose')



// const kycVerification = async (req, res) => {
//     try {
//         // const { token } = req.params;

//         // // Extract KYC data from request body
//         // const { fullName, gender, dateOfBirth, SSN, occupation, billingAddress } = req.body;

       

//         // if (!token) {
//         //     return res.status(400).json({ message: 'Token not found' });
//         // }

//         // // Verify token and find user by email
//         // const { email } = jwt.verify(token, process.env.SECRET_KEY);
//         // const user = await userModel.findOne({ email });

//         // if (!user) {
//         //     return res.status(404).json({ message: 'User not found' });
//         // }
//         //  if(user.kyc.verified = true){
//         //     return res.status(404).json({message:'user kyc already verified'})
//         //  }
       
//         // const ssnPattern = /^\d{9}$/;

//         // // Validate KYC data
//         // if (!fullName || fullName.trim().length === 0) {
//         //     throw new Error("fullName field cannot be empty");
//         // }
//         // if (!gender || gender.trim().length === 0) {
//         //     throw new Error("gender field cannot be empty");
//         // }
//         // if (!dateOfBirth || dateOfBirth.trim().length === 0) {
//         //     throw new Error("dateOfBirth field cannot be empty");
//         // }
//         // if (!SSN || !ssnPattern.test(SSN)) {
//         //     throw new Error("Invalid SSN format");
//         // }
//         // if (!occupation || occupation.trim().length === 0) {
//         //     throw new Error("occupation field cannot be empty");
//         // }
//         // if (!billingAddress || billingAddress.trim().length === 0) {
//         //     throw new Error("billingAddress field cannot be empty");
//         // }
          
        

//         // const license = await cloudinary.uploader.upload(req.files.driversLicense.tempFilePath, {
//         //         folder: 'asset_Mogul', // Specify the folder name here
//         //      //   allowed_formats: ['txt', 'doc', 'pdf', 'docx', 'png', 'jpeg'], // Allow these file formats
//         //         max_file_size: 2000000 // Maximum file size in bytes (2MB)
//         //     }, (error, result) => {
//         //         if (error) {
//         //             return(error);
//         //         } else {
//         //         return(result);
//         //         }
//         //     }); 
//         console.log("driversFront", req.files)



        
// //         const licenseBack = await cloudinary.uploader.upload(req.files.driversLicenseBack.tempFilePath, {
// //                 folder: 'asset_Mogul', // Specify the folder name here
// // //allowed_formats: ['txt', 'doc', 'pdf', 'docx', 'png', 'jpeg'], // Allow these file formats
// //                 max_file_size: 2000000 // Maximum file size in bytes (2MB)
// //             }, (error, result) => {
// //                 if (error) {
// //                     return (error);
// //                 } else {
// //                     return (result);
// //                 }
// //             }); 
          
        
 
      
//         // Create KYC document and save to database
//         // const kycDoc = new kycModel({
//         //     fullName,
//         //     gender,
//         //     dateOfBirth,
//         //     SSN,
//         //     occupation,
//         //     billingAddress,
//         //     driversLicense:{ public_id: license.public_id, url: license.url },
//         //     driversLicenseBack:{ public_id: licenseBack.public_id, url: licenseBack.url },
//         //     userId: user._id
//         // });
                

//         // const savedKycDoc = await kycDoc.save();

//         // // Update user's KYC ID and set verification status to true
//         // user.kyc = { id: savedKycDoc._id };
//         // await user.save();

//         // // Prepare attachments for email
//         // const attachments = driversLicense.map((license, index) => ({
//         //     filename: `driversLicense_${index + 1}.jpg`,
//         //     path: license.url
//         // }));

//         // // Send email to admin
//         // const html = KycVericationMail(savedKycDoc);
//         // const data = {
//         //     email: process.env.AdminMail,
//         //     subject: "User Uploaded KYC Form",
//         //     html: html,
//         //     attachments: attachments
//         // };
//         // await sendEmail(data);

//         res.status(200).json({ message: 'KYC verification ' });
//         // res.status(200).json({ message: 'KYC verification successful', kycDoc });
//     } catch (error) {
//         res.status(500).json({ "messagesssss": error.message });
//     }
// };


// module.exports = kycVerification


