const mongoose = require('mongoose')
const kycSchema = new mongoose.Schema({
    fullName:{type:String, require:true},
    driversLicense:[ {
        public_id: { type: String},
         url:{ type: String, }
     
    }
],
    // driversLicenseBack: {
    //     public_id: { type: String},
    //      url:{ type: String, },
        
    // },
    
    gender:{
        type:String,
        enum:['Male', 'Female', 'Non binary','Transgender', 'Nonbinary', 'Cisgender', 'others','prefer not to answer'],
        required:true
    },
    dateOfBirth:{type:String, require:true}, 
    
    SSN:{type:String, require:true},

    occupation:{type:String, require:true},

    billingAddress:{type:String, require:true},

    approved:{type:Boolean,default:false},

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

},
{timestamps:true})

const kycModel = mongoose.model("kyc", kycSchema)
module.exports = kycModel

