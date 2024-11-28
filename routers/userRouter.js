const express = require ('express')
const router = express.Router()
const upload = require('../helpers/multer')
const {welcome,signUpUser,verifyOtp,resendVerificationOtp,login,ViewProfile,
    assignMoneyToUser,assignProfitToUser, deleteUser,deactivateUser,
    updateUser,logout,getUserDepositWallet,getuserReferalWallet,getuserIntrestWallet,
    getAllUsers,getUserTotalBalance,getAllUserCount,getPendingDeposit,getPendingwithdrawl,getRejectedWithdral, getUserStatusBar,updateUsersWithNewFields} = require('../controllers/usercontroller')
const {resetPassword,changePassword,forgotPassword} = require ('../controllers/passwordController')
const {authenticateUser,Role} = require('../middlewares/authorisation')
const {getTransactionHistory,getLatestTransaction} = require('../controllers/transation')
const checkResendCooldown = require('../controllers/verifyOptions')



router.route('/').get(welcome); 
router.route("/registration").post(signUpUser)
router.route("/getAllUsers").get(getAllUsers)
router.route("/getAllUsersCount").get(getAllUserCount)
router.route("/logout/:userId").post(authenticateUser,logout)
router.route("/getUserDepositWallet/:userId").get(getUserDepositWallet)
router.route("/getuserReferalWallet/:userId").get(getuserReferalWallet)
router.route("/getuserIntrestWallet/:userId").get(getuserIntrestWallet)
router.route("/getUserTotalBalance/:userId").get(getUserTotalBalance)
router.route("/getPendingwithdrawl/:userId").get(getPendingwithdrawl)
router.route("/RejectedWithdral/:userId").get(getRejectedWithdral)
router.route("/getPendingDeposit/:userId").get(getPendingDeposit)
router.route("/verifyOtp/:token").post(verifyOtp)
router.route("/resendVerificationOtp").post(resendVerificationOtp)
router.route("/login").post(login)
router.route("/profile/:userId").get(authenticateUser,ViewProfile)
router.route("/assignMoney").post(assignMoneyToUser)
// router.route("/assignProfit").post(assignProfitToUser)
 router.route("/assignProfit/").post(authenticateUser,Role,assignProfitToUser)
router.route("/delete").put(authenticateUser,Role,deleteUser)
router.route("/deacvtivateUser").put(authenticateUser,Role,deactivateUser)
router.route("/resetPassword/:token").post(resetPassword)
router.route("/changePassword/:token").post(authenticateUser,changePassword)
router.route("/forgotPassword").post(forgotPassword)
router.route("/udpateUsers").put(updateUsersWithNewFields)

router.route("/updateUser/:userId").put(authenticateUser,updateUser)
 router.route("/getTransactionHistory/:userId").get(getTransactionHistory)
 router.route("/getLatestTransaction/:userId").get(getLatestTransaction)
 router.route("/getUserStatusBar/:userId").get(getUserStatusBar)





module.exports = router












