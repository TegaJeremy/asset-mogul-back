const express = require ('express')
const router = express.Router()
const {kycVerification, KycData,approveKyc,getUsersKYCWithUnverifiedKYC,rejectKyc,getUnverifiedKYCCount} = require('../controllers/kycController')
const {authenticateUser } = require('../middlewares/authorisation')
// const kycVerification = require ('../controllers/verifyOptions')

router.route("/kycVerification/:token").post(kycVerification)
// router.route("/kycVerification/:token").post(kycVerification)
router.route("/KycData/").get(KycData)
router.route("/approveKyc/").post(approveKyc)
router.route("/rejectKyc/").post(rejectKyc)
router.route("/getUsersKYCWithUnverifiedKYC/").get(getUsersKYCWithUnverifiedKYC)
router.route("/unverifiedCount/").get(getUnverifiedKYCCount)


module.exports = router


