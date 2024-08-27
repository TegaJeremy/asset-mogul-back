const cloudinary = require("cloudinary").v2
require ('dotenv').config

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret:process.env.API_SECRET
  });

  // Retrieve current upload preset settings
cloudinary.api.upload_preset('z8wu9tkt', (error, result) => {
  if (error) {
    console.error('Error retrieving upload preset:', error);
  } else {
    // Modify the allowed formats to include .txt and .docx
    const updatedPreset = {
      ...result.settings,
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'txt']
    };

    // Update the upload preset with the modified settings
    cloudinary.api.update_upload_preset('z8wu9tkt', updatedPreset, (updateError, updateResult) => {
      if (updateError) {
        // console.error('Error updating upload preset:', updateError);
      } else {
        // console.log('Upload preset updated successfully:', updateResult);
      }
    });
  }
});



module.exports = cloudinary;