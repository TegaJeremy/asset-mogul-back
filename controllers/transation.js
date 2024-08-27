const transationModel = require('../models/transationModel')

const getTransactionHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await transationModel.find({ userId }).sort({ timestamp: -1 });
        res.status(200).json({ message: 'Transaction history retrieved successfully', data: transactions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// transactionController.js


const getLatestTransaction = async (req, res) => {
    try {
        const { userId } = req.params;
        const latestTransaction = await transationModel.findOne({ userId }).sort({ timestamp: -1 }).limit(1);
        res.status(200).json({ message: 'Latest transaction retrieved successfully', data: latestTransaction });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// transactionController.js
const deleteOldTransactions = async () => {
    try {
        // Calculate the date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Find transactions older than 30 days
        const oldTransactions = await transationModel.find({ timestamp: { $lt: thirtyDaysAgo } });

        // Delete the old transactions
        await transationModel.deleteMany({ _id: { $in: oldTransactions.map(transaction => transaction._id) } });

        console.log(`Deleted ${oldTransactions.length} transactions older than 30 days.`);
    } catch (error) {
        console.error('Error deleting old transactions:', error);
    }
};


const deleteAllTransactions = async () => {
    try {
        // Delete all transactions
        const result = await transationModel.deleteMany({});
        
        console.log(`Deleted ${result.deletedCount} transactions.`);
    } catch (error) {
        console.error('Error deleting transactions:', error);
    }
};




module.exports = { getTransactionHistory,
    getLatestTransaction,
    deleteOldTransactions,
    deleteAllTransactions };