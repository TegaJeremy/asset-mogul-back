// const nodemailer = require("nodemailer");
// require("dotenv").config();
// let userEmail ="assetMogulplus@gmail.com";
// let displayName = userEmail.split('@')[0]
// let mainMail = process.env.displayName
// let displayName = mainMail.split('@')[0]


// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host:"smtp.gmail.com",
//         service:"gmail",
//           port:587,
//         auth: {
//             user:process.env.user,
//             pass:process.env.password
//         },
//         tls:{
//             rejectUnauthorized: false,
//            },
//     });

//     function getDisplayName(email){
//         return email.split('@')[0]
//     }
//     let userEmail = 'assetMogulplus@gmail.com'
//     let displayName = process.env.from_Name


//     try {
//         const info = await transporter.sendMail({
//             // from: process.env.displayName,
//             from: ,          
//             to: options.email,
//             subject: options.subject,
//             html: options.html
//         });

//         console.log("Message sent: %s", info.messageId);
//         return info;
//     } catch (error) {
//         console.error("Error sending email:", error);
//         throw error;
//     }
// };



// const sendEmail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: "smtp.gmail.com",
//         service: "gmail",
//         port: 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: process.env.user,
//             pass: process.env.password
//         },
//         tls: {
//             rejectUnauthorized: false,
//         },
//     });

//     const fromAddress = `"${process.env.from_Name}" <${process.env.user}>`;

//     try {
//         const info = await transporter.sendMail({
//             from: fromAddress,          
//             to: options.email,
//             subject: options.subject,
//             html: options.html
//         });

//         console.log("Message sent: %s", info.messageId);
//         return info;
//     } catch (error) {
//         console.error("Error sending email:", error);
//         throw error;
//     }
// };



const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",  // Use Zoho SMTP server
        port: 465,  // Use 465 for SSL
        secure: true,  // true for 465, false for other ports like 587
        auth: {
            user: process.env.ZOHO_USER,  // Your Zoho email address
            pass: process.env.ZOHO_PASSWORD  // Your Zoho password or app-specific password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const fromAddress = `"${process.env.FROM_NAME}" <${process.env.ZOHO_USER}>`;

    try {
        const info = await transporter.sendMail({
            from: fromAddress,          
            to: options.email,  // recipient email
            subject: options.subject,  // email subject
            html: options.html  // email body content
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;






module.exports = sendEmail;



