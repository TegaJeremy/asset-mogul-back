const mongoose = require("mongoose")

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String, 
        required: true
    },
    Name: {
        type: String
    },
    email: {
        type: String
    },
    subject: {
        type: String
    },
    pirority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'replied'],
        required: true
    },
    messages: {
        type: [String],
        default: []
    },
        pictures: [
        {
            public_id: { type: String },
            url: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      createdAt: {
        type: Date, // Define the createdAt field as type Date
        default: Date.now
    }
})

const ticketModel = mongoose.model("ticket", ticketSchema)
module.exports = ticketModel