const express = require ('express')
const router = express.Router()
const {deposit, depositHistory,getTotalDeposit} = require('../controllers/depositController')
const upload = require('../helpers/multer')

router.route("/DepositFunds/:userId").post(deposit);
router.route("/depositHistory/:userId").get(depositHistory);
router.route("/getTotalDeposit/:userId").get(getTotalDeposit);
    

module.exports = router

