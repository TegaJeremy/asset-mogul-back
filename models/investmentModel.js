const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    amount: { type: Number, required: true },
    plan: { 
        type: String, 
        enum: ['basic', 'pro', 'premium', 'retirement', 'ultimate'], 
        required: true 
    },
    wallet: { 
        type: String, 
        enum: ['accountBalance','depositWallet', 'intrestWallet', 'referalWallet',], 
        required: true 
    },
    scheduleType: {
        type: String,
        enum: ['now', 'later'],
        required: true
    },
    scheduleTime: { type: Date }, // Only applicable if scheduleType is 'later'
   
    endDate: { type: Date }, // End date for scheduled investments
    createdAt: { type: Date, default: Date.now },
    ongoing:{type:Boolean, default:false},
    investmentId: {
        type: String, 
        required: true
    },
});



module.exports = mongoose.model('Investment', investmentSchema);






