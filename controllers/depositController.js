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
         // Update PendingDeposit, converting amount to a number
         user.pendingDeposit += Number(amount); // Convert amount to number before adding
         await user.save();
      
        
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

// const getTotalDeposit = async (req,res) => {
//     try {
//         const {userId} = req.params
//         // Find all deposit records for the user
//         const deposits = await depositModel.find({ userId });

//         // Calculate total deposit amount
//         let totalDeposit = 0;
//         deposits.forEach(deposit => {
//             totalDeposit += parseFloat(deposit.amount);
//         });

//        res.status(200).json({message:'total deposited amount:',totalDeposit})
//     } catch (error) {
//         throw new Error("Error calculating total deposit");
//     }
// };


const getTotalDepositsForAllUsr = async (req, res) => {
    try {
        // Use the aggregate method to sum all deposit amounts
        const totalDeposits = await depositModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);

        // If no deposits are found, return a total of 0
        const totalAmount = totalDeposits.length > 0 ? totalDeposits[0].totalAmount : 0;

        res.status(200).json({ message: 'Total deposits calculated successfully', totalAmount });
    } catch (error) {
        console.error('Error while calculating total deposits:', error);
        res.status(500).json({ message: 'Internal server error' });
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


// const getLastDeposit = async (req, res) => {
//     try {
//         const { userId } = req.params;

//         // Find the latest deposit record for the user, sorted by creation date (most recent first)
//         const latestDeposit = await depositModel.findOne({ userId }).sort({ createdAt: -1 });

//         // If no deposit is found, return 0 as the amount
//         const amount = latestDeposit ? latestDeposit.amount : 0;

//         // Return the amount (0 if no deposit was found)
//         res.status(200).json({ amount });
//     } catch (error) {
//         console.error('Error retrieving latest deposit:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };



const getLastDeposit = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Log the sorting field for debugging
        console.log('Sorting deposits by createdAt and _id for user:', userId);

        // Fetch the latest deposit, sorting by createdAt and _id as a fallback
        const latestDeposit = await depositModel
            .findOne({ userId })
            .sort({ createdAt: -1, _id: -1 }) // Sort by creation date, then by ID
            .lean();

        if (!latestDeposit) {
            return res.status(200).json({
                message: 'No deposits found for this user',
                amount: 0,
            });
        }

        // Respond with the latest deposit details
        res.status(200).json({
            
            amount: latestDeposit.amount,
            
        });
    } catch (error) {
        console.error('Error retrieving latest deposit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};








module.exports = {
    deposit,
    depositHistory,
    getTotalDeposit,
    getTotalDepositsForAllUsr,
    getLastDeposit
}
