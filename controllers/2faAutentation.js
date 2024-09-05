const speakeasy  = require('speakeasy')
const qrcode = require ('qrcode')
const express = require('express')
const app = express()
const router = express.Router()
const userModel = require ('../models/userModel')
const jwt = require('jsonwebtoken')
  


//generate a secret
// const secret = speakeasy.generateSecret({length:20})
// const secretBase32 = secret.base32

// //generate qr code url
// const qrCodeUrl = `otpauth://totp/ asset mogulestment?secret=${encodeURIComponent(
//     secretBase32
// )}`

// //generate QR code image
// let qrCodeImageUrl;
// qrcode.toDataURL(qrCodeUrl, (err, imageUrl)=>{
//     if (err) {
//         console.error('error generating QR code', err)
        
//     } else {
//         qrCodeImageUrl = imageUrl
//     }
// })

// //verify otp token
// function verifyToken(token, secret){
//     return speakeasy.totp.verify({secret, encoding:"base32", token})
// }
// //routes
// router.get("/", (req,res)=>{
//     res.send(`<h1>Two factor auntentication (2FA) with google auth</h1>
//     <img src="${qrCodeImageUrl}" alt="QR CODE">
//     <br>
//     <p> secret key : ${secretBase32}</p>
//     <form action =" /verify" method="post">
//     <lebel form"token">enter token:</lebel>
//     <input type="text" id="token" name="token">
//     <button type= "submit">verify</button>
//     </form>
    
    
    
//     `)
// })



// router.post("/verify", express.urlencoded({ extended: true }), (req, res) => {
//     const { token } = req.body;
//     const isTokenValid = verifyToken(token, secretBase32);
//     if (isTokenValid) {
//         res.send("<h2>Token is valid</h2>");
//     } else {
//         res.send("<h2>Token is invalid</h2>");
//     }
// });

// module.exports = router;

// Generate a secret
const secret = speakeasy.generateSecret({ length: 16 });
const secretBase32 = secret.base32;


//generate qr code url
const qrCodeUrl = `otpauth://totp/ asset mogulestment?secret=${encodeURIComponent(
    secretBase32
)}`

//generate QR code image
let qrCodeImageUrl;
qrcode.toDataURL(qrCodeUrl, (err, imageUrl)=>{
    if (err) {
        console.error('error generating QR code', err)
        
    } else {
        qrCodeImageUrl = imageUrl
    }
})

// Verify OTP token
function verifyToken(token, secret) {
    return speakeasy.totp.verify({ secret, encoding: 'base32', token });
}

exports.getQRCodePage = (req, res) => {
    res.send(`
        <h1>Two factor authentication (2FA) with Google Auth</h1>
        <img src="${qrCodeImageUrl}" alt="QR CODE">
        <br>
        <p> Secret key: ${secretBase32}</p>
        <form action="/verify" method="post">
            <label for="token">Enter token:</label>
            <input type="text" id="token" name="token">
            <button type="submit">Verify</button>
        </form>
    `);
};


exports.getQRCodeData = (req, res) => {
    const data = {
        qrCodeImageUrl: qrCodeImageUrl,
        secretBase32: secretBase32
    };
    res.json(data);
};


// exports.verifyToken =async (req, res) => {

//     try {
//         const { token } = req.body;
//          // Verify the user's token
//       const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

//       // Get the user's Id from the token
//       const userId = decodedToken.userId;

//        // Find the user by ID
//        const user = await userModel.findById(userId);
       
//         // Verify the token
//         const isTokenValid = verifyToken(token, secretBase32);

//         if (isTokenValid) {
//             res.send("Token is valid, account confirmed");
//             await user.twoFactor = true
            
//         } else {
//             res.send('Token is invalid');
//         }
//     } catch (error) {
//         console.error('Error verifying token:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify the user's token
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        // Get the user's Id from the token
        const userId = decodedToken.userId;

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify the token (assuming verifyToken is a function that you have created to check tokens)
        const isTokenValid = verifyToken(token, process.env.SECRET_BASE32);

        if (isTokenValid) {
            user.twoFactor = true;
            await user.save(); // Save the updated user document to the database
            res.send("Token is valid, account confirmed");
        } else {
            res.send('Token is invalid');
        }
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};






// exports.verifyToken = async (req, res) => {
//     try {
//         const { token } = req.body;

//         // Verify the token
//         const isTokenValid = verifyToken(token, secretBase32);

//         if (isTokenValid) {
//             // Find the user by some identifier (e.g., user ID or email)
//             const user = await UserModel.findById(userId); // Replace userId with the actual user ID

//             if (!user) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             // Update the user's 2FA status to true
//             user.is2FAEnabled = true; // Assuming the field name is 'is2FAEnabled'

//             // Save the updated user model
//             await user.save();

//             // Send response indicating successful token verification
//             res.send('<h2>Token is valid</h2>');
//         } else {
//             // Send response indicating invalid token
//             res.send('<h2>Token is invalid</h2>');
//         }
//     } catch (error) {
//         console.error('Error verifying token:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };


