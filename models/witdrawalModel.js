const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  amount: { type: Number, required: true }, // Storing amount as a number for better validation
  method: { type: String, enum: ['crypto', 'bank'], required: true }, // Withdrawal method

  // Fields for crypto withdrawal
  cryptoDetails: {
    walletName: { type: String },
    walletAddress: { type: String },
  },

  // Fields for bank withdrawal
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
    accountHolderName: { type: String },
    swiftCode: { type: String },
    routingNumber: { type: String },
  },

  withdrawId: {
    type: String,
    required: true,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('withdraw', withdrawSchema);



