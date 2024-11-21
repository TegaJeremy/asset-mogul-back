const express = require ('express')
const router = express.Router()
const {basicPlan,proPlan,premiumPlan,retirementPlan,Ultimate,calculateTotalInvestmentCount,calculateTotalProfit,getTotalBalance,withdrawMoney,
    getOngoingPlans,endedPlans,getScheduledInvestmentsByUserId,withdrawalHistory,getTotalWithdraw,
    getWithdrawalRequests,getLastWithdrawal,getTotalWithdrawals,getLastInvestment,
    getRunningInvestment,getCompletedInvestment,acceptWithdrawal,rejectWithdrawal} = require('../controllers/investmestController')
const {authenticateUser} = require('../middlewares/authorisation')

router.route("/basicPlan/:userId").post(basicPlan)
router.route("/proPlan/:userId").post(authenticateUser,proPlan)
router.route("/premiumPlan/:userId").post(authenticateUser,premiumPlan)
router.route("/retirementPlan/:userId").post(authenticateUser,retirementPlan)
router.route("/UltimatePlan/:userId").post(authenticateUser,Ultimate)
router.route("/calInv/:userId").get(calculateTotalInvestmentCount)
router.route("/calTotalProfits/:userId").get(calculateTotalProfit)
router.route("/totalBalance/:userId").get(getTotalBalance)
router.route("/getTotalWithdraw/:userId").get(getTotalWithdraw)
router.route("/getTotalWithdrawals/:userId").get(getTotalWithdrawals)
router.route("/rejectWithdrawal").post(rejectWithdrawal)
 router.route("/acceptWithdrawal").post(acceptWithdrawal)
router.route("/getWithdrawalRequests").get(getWithdrawalRequests)
router.route("/getLastWithdrawal/:userId").get(getLastWithdrawal)
router.route("/withdrawMoney/:userId").post(withdrawMoney)
router.route("/withdrawalHistory/:userId").get(withdrawalHistory)
router.route("/getTotalWithdraw/:userId").get(getTotalWithdraw)
router.route("/getOngoingPlans/:userId").get(getOngoingPlans)
router.route("/endedPlans/:userId").get(endedPlans)
router.route("/getScheduledInvestments/:userId").get(getScheduledInvestmentsByUserId)
router.route("/getLastInvestment/:userId").get(getLastInvestment)
 router.route("/getRunningInvestment/:userId").get(getRunningInvestment)
 router.route("/getCompletedInvestment/:userId").get(getCompletedInvestment)

module.exports = router


