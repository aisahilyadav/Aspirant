import multer from 'multer';

// Use memory storage instead of disk storage
const storage = multer.memoryStorage();

// file filter: only pdfs
const fileFilter = function (req, file, cb) {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// create upload middleware with size limit
const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit (adjust as needed)
  }
});

export default upload;
