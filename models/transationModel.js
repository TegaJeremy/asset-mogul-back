// transactionModel.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['deposit', 'investment', 'withdrawal'] },
    amount: Number,
    userId:{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    ID:{type:String},
    timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;