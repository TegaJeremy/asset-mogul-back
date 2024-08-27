const nodemailer = require("nodemailer");
require("dotenv").config();
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



const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        service: "gmail",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.user,
            pass: process.env.password
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const fromAddress = `"${process.env.from_Name}" <${process.env.user}>`;

    try {
        const info = await transporter.sendMail({
            from: fromAddress,          
            to: options.email,
            subject: options.subject,
            html: options.html
        });

        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};






module.exports = sendEmail;



