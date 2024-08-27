const mongoose = require('mongoose');

const withdrawSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    amount: { type: String, required: true },
    
    // wallet: { 
    //     type: String, 
    //     enum: ['depositWallet', 'intrestWallet', 'referalWallet',], 
    //     required: true 
    // },
    withdrawId: {
        type: String, 
        required: true
    },
   
    createdAt: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model('withdraw', withdrawSchema);



