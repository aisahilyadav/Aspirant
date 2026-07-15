import { createDirectUploadSignature } from '../services/directUpload.service.js';

export function signPdfUpload(req, res, next) {
  try {
    const upload = createDirectUploadSignature(req.body.fileHash);
    const uploadUrl = `https://api.cloudinary.com/v1_1/${upload.cloudName}/${upload.resourceType}/upload`;

    res.json({ ...upload, uploadUrl });
  } catch (error) {
    next(error);
  }
}
