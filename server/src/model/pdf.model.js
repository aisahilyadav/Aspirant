import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  filename: String,
  cloudinaryUrl: String,
  fileHash: String,
  publicId: String,
  createdAt: { type: Date, default: Date.now }
});


//export default mongoose.model('Pdf', pdfSchema);
export const Pdf =  mongoose.model('Pdf', pdfSchema);
