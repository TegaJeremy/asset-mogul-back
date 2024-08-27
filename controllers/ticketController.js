const ticketModel = require("../models/ticketModel")
const userModel = require("../models/userModel")
const cloudinary = require('../helpers/cloudinary')
const moment = require('moment');
const mongoose = require('mongoose')
const {ticketCreationNotificationMail} = require('../utils/mailTemplates')
const sendEmail = require('../middlewares/mail')


const createTicket = async (req, res) => {
    try {
        const { userId } = req.params;
        const { Name, email, subject, pirority, message } = req.body;

        // Find the user by ID
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        console.log(user)

        // Generate a random ticket number
        function generateRandomNumbers() {
            const randomNumbers = [];
            for (let i = 0; i < 6; i++) {
                randomNumbers.push(Math.floor(Math.random() * 10)); // Generates a random number between 0 and 9
            }
            const ticketNumber = randomNumbers.join(''); // Convert array to string
            return `#${ticketNumber}`; // Prepend "#" symbol to the ticket number
        }

        // Get current date/time
        const createdAt = new Date();

        let pictures = []; // Array to store uploaded pictures

        // Check if pictures are uploaded
        if (req.files && req.files.pictures && Array.isArray(req.files.pictures)) {
            // Check if the number of pictures exceeds the maximum allowed (5 in this example)
            if (req.files.pictures.length > 5) {
                return res.status(400).json({ message: "You can only upload a maximum of 5 pictures" });
            }

            // Upload each picture to Cloudinary
            for (const file of req.files.pictures) {
                const pic = await new Promise((resolve, reject) => {
                    cloudinary.uploader.upload(file.tempFilePath, {
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

                // Push the uploaded picture to the array
                pictures.push({
                    public_id: pic.public_id,
                    url: pic.secure_url, // Use secure_url for HTTPS URL
                    createdAt: new Date() // Add createdAt field for the ticket picture
                });
            }
        }

        // Construct the ticket data object
        const ticketData = {
            ticketId: generateRandomNumbers(),
            Name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            subject,
            pirority,
            status: "open",
            messages: [message],
            pictures,
            user: userId,
            createdAt
        };

        // Create the ticket
        const savedTicket = await ticketModel.create(ticketData);

        // Update user's tickets array
        user.tickets.push(savedTicket._id);
        await user.save();

        console.log("New Ticket Created At:", savedTicket.createdAt);

        const recipients = process.env.loginMails.split(',').filter(email => email.trim() !== ''); // Filter out empty emails
        
        if (recipients.length === 0) {
            throw new Error("No recipients defined");
        }

        const html = ticketCreationNotificationMail(user, ticketData,);
        const emailData = {
            subject: "Ticket created",
            html
        };

        for (const recipient of recipients) {
            emailData.email = recipient.trim();
            await sendEmail(emailData);
        }

        return res.status(200).json({
            message: "Ticket created successfully",
            data: savedTicket
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};








const getUserTickets = async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by userId
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Find all tickets associated with the user
        const userTickets = await ticketModel.find({ user: userId });

        if (!userTickets || userTickets.length === 0) {
            return res.status(404).json({
                message: "No tickets found for this user"
            });
        }

       // Calculate the relative time for each ticket
       const currentTime = moment();
       userTickets.forEach(ticket => {
           const ticketCreationTime = moment(ticket.createdAt);
           const relativeTime = moment.duration(currentTime.diff(ticketCreationTime));
           const minutes = Math.floor(relativeTime.asMinutes());
       
           if (minutes <= 0) {
               ticket.createdAt = `just now`;
           } else if (minutes < 60) {
               ticket.createdAt = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
           } else if (minutes < 1440) {
               const hours = Math.floor(minutes / 60);
               ticket.createdAt = `${hours} hour${hours > 1 ? 's' : ''} ago`;
           } else if (minutes < 10080) {
               const days = Math.floor(minutes / 1440);
               ticket.createdAt = `${days} day${days > 1 ? 's' : ''} ago`;
           } else if (minutes < 43200) {
               const weeks = Math.floor(minutes / 10080);
               ticket.createdAt = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
           } else {
               ticket.createdAt = moment(ticket.createdAt).fromNow();
           }
       });
        return res.status(200).json({
            message: "Tickets found",
            data: userTickets
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};



const replyToTicket = async (req, res) => {
    try {
        let { ticketId } = req.params;
        const { replyMessage } = req.body;

        // If ticketId does not start with "#", prepend it
        if (!ticketId.startsWith("#")) {
            ticketId = `#${ticketId}`;
        }

        // Find the ticket by ticketId
        const ticket = await ticketModel.findOne({ ticketId: ticketId });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

          
     // Push the reply message to the messages array
     ticket.messages.push(replyMessage);
   

       // Update the ticket with the new message and new createdAt
       ticket.createdAt = new Date(); // Update createdAt to current date/time
       await ticket.save();

      ticket.status = "replied"
       await ticket.save();

        return res.status(200).json({ message: "Ticket replied successfully", ticket });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const getUserTicketsByEmail = async (req, res) => {
    try {
        const { userEmail } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find all tickets associated with the user
        const tickets = await ticketModel.find({ user: user._id });

        return res.status(200).json({
            message: "User tickets retrieved successfully",
            data: tickets
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};


const closeTicket = async (req, res) => {
    try {
        let { ticketId } = req.body; // Assuming ticketId is sent in the request body

        // Remove '#' from ticketId if present
        if (ticketId.startsWith("#")) {
            ticketId = ticketId.slice(1);
        }

        // Find the ticket by ticketId
        const ticket = await ticketModel.findOne({ ticketId: ticketId });
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        // Update ticket status to "closed"
        ticket.status = "closed";
        await ticket.save();

        return res.status(200).json({ message: "Ticket closed successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};








module.exports = {
    createTicket,
    getUserTickets,
    replyToTicket,
    getUserTicketsByEmail,
    closeTicket
}