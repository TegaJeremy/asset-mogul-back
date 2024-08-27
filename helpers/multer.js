const multer = require('multer');

// // Set storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Define the destination directory where uploaded files will be stored
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     // Define the filename for the uploaded file
//     cb(null, Date.now() + '-' + file.originalname)
//   }
// })

// // Define file filter function
// const fileFilter = (req, file, cb) => {
//   // Check if the file type is allowed
//   const allowedFileTypes = /jpg|jpeg|png|pdf|doc|docx/;
//   const extname = allowedFileTypes.test(file.originalname.toLowerCase().split('.').pop());
//   const mimetype = allowedFileTypes.test(file.mimetype);
//   if (extname && mimetype) {
//     // File type is allowed
//     cb(null, true);
//   } else {
//     // File type is not allowed
//     cb(new Error('Only JPG, JPEG, PNG, PDF, DOC, DOCX files are allowed'));
//   }
// };

// // Initialize multer and specify the storage and file filter options
// const upload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024 // Limit file size to 2MB
//   }
// });

// // Export the configured upload middleware for use in routes or controllers
// module.exports = upload;
const storage = multer.diskStorage( {
  destination: (req, file, cb) => {
      cb( null, './uploads' );
  },
  filename: (req, file, cb) => {
      cb(null, new date().toIDOString() + '-' + file.originalname)
  }
} );


const fileFilter = (req, file, cb) => {
  if ( file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'  ) {
      cb(null, true)
  } else {
      cb(new Error("unsupported file format"), false)
  }
}

const fileSize = {
  limits: 1024 * 1024 * 10,
}


const upload  = multer( {
  storage: storage,
  fileFilter: fileFilter,
  fileSize: fileSize,
})


module.exports = upload;




