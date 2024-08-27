const depositModel =require ('../models/depositModel')
const userModel = require('../models/userModel')
const cloudinary = require('../helpers/cloudinary')
const sendEmail = require('../middlewares/mail')
const {depositMail,userEmailTemplate} = require ('../utils/mailTemplates')
const transationModel = require('../models/transationModel')


const deposit = async (req, res) => {
    try {
        const { userId } = req.params;
        const {amount} = req.body
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

         // Generate a random deposit number
         function generateRandomNumbers() {
            const randomNumbers = [];
            for (let i = 0; i < 6; i++) {
                randomNumbers.push(Math.floor(Math.random() * 10)); // Generates a random number between 0 and 9
            }
            const depositNumber = randomNumbers.join(''); // Convert array to string
            return `#${depositNumber}`; // Prepend "#" symbol to the ticket number
        }
    

        // Upload file to Cloudinary with specific options
        const payment = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload(req.files.proofOfPayment.tempFilePath, {
                folder: 'asset_Mogul', // Specify the folder name here
                allowed_formats: ['txt', 'doc', 'pdf', 'docx', 'png', 'jpeg'], // Allow these file formats
                max_file_size: 2000000 // Maximum file size in bytes (2MB)
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
                

        // Create deposit record
        const depositRecord = new depositModel({
            amount,
            proofOfPayment: { public_id: payment.public_id, url: payment.url },
            timestamp: Date.now(),
            depositId:generateRandomNumbers(),
            userId:user._id
        });


         // sending an email to the admin telling him that a user has uplooded proof of payment
        const recipients = process.env.loginMails.split(',');
        htmlTem =depositMail(payment,user)
        const data = {
            email: process.env.loginMails,
            subject: "New Deposit Proof of Payment",
            html:htmlTem,
            attachments: [
                {
                    filename: 'proof_of_payment.jpg',
                    path: payment.url // Access payment.url here
                }
            ]
        };

        const depositTransaction = new transationModel({
            type: 'deposit',
            amount:depositRecord.amount ,
            userId: req.params.userId,
            ID:depositRecord.depositId
            
        });
     
        await depositTransaction.save();
      
        
   // sending an email to the user that the upload has been confirmed
        await sendEmail(data);
            htmlBody=userEmailTemplate(depositRecord)
        const data2 = {
            email:user.email,
            subject:  "deposit funds uploaded",
            html:htmlBody
        };
        await sendEmail(data2);
        await depositRecord.save();

        res.status(200).json({ message: 'Deposit successful', data: depositRecord,depositTransaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const depositHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Find deposit records associated with the user
        const deposits = await depositModel.find({ userId }).sort({ timestamp: -1 });

        if (!deposits) {
            return res.status(404).json({ message: 'Deposit history not found for this user' });
        }

        res.status(200).json({ message: 'Deposit history retrieved successfully', data: deposits });
    } catch (error) {
        res.status(500).json({ message: error.message });
   
    }
};

const getTotalDeposit = async (req,res) => {
    try {
        const {userId} = req.params
        // Find all deposit records for the user
        const deposits = await depositModel.find({ userId });

        // Calculate total deposit amount
        let totalDeposit = 0;
        deposits.forEach(deposit => {
            totalDeposit += parseFloat(deposit.amount);
        });

       res.status(200).json({message:'total deposited amount:',totalDeposit})
    } catch (error) {
        throw new Error("Error calculating total deposit");
    }
};









module.exports = {
    deposit,
    depositHistory,
    getTotalDeposit
}
