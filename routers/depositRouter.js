const express = require ('express')
const router = express.Router()
const {deposit, depositHistory,getTotalDeposit,getTotalDepositsForAllUsr,getLastDeposit} = require('../controllers/depositController')
const upload = require('../helpers/multer')

router.route("/DepositFunds/:userId").post(deposit);
router.route("/depositHistory/:userId").get(depositHistory);
router.route("/getTotalDeposit/:userId").get(getTotalDeposit);
router.route("/getTotalDepositsForAllUsr").get(getTotalDepositsForAllUsr);
router.route("/getLastDeposit/:userId").get(getLastDeposit);


module.exports = router





