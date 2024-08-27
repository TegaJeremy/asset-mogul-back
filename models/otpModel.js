const mongoose = require('mongoose')


const userOtpVerificationSchema = new mongoose.Schema({
   
    otp :{
        type:String,
        required:true,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    //after 5 minutes this will bw deleted authomatically from the database
   createdAt:{type:Date, default:Date.now, index:{expires:"300s"}}
},{timestamps:true}
)
const userOtpVerification = mongoose.model("otpverification", userOtpVerificationSchema)

module.exports=userOtpVerification
