import crypto from 'node:crypto';
import cloudinary from '../utils/cloudinary.js';

export const MAX_PDF_BYTES = 50 * 1024 * 1024;

const PDF_HASH_PATTERN = /^[a-f0-9]{64}$/;
const UPLOAD_FOLDER = 'pdfs';

const httpError = (status, message) => Object.assign(new Error(message), { status });

export function createDirectUploadSignature(fileHash) {
  if (!PDF_HASH_PATTERN.test(fileHash || '')) {
    throw httpError(400, 'A valid SHA-256 file hash is required');
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME
    || !process.env.CLOUDINARY_API_KEY
    || !process.env.CLOUDINARY_API_SECRET
  ) {
    throw httpError(500, 'Cloudinary is not configured');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `pdf_${fileHash}`;
  const uploadParams = {
    folder: UPLOAD_FOLDER,
    overwrite: false,
    public_id: publicId,
    timestamp,
    type: 'authenticated',
  };

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    resourceType: 'raw',
    uploadParams,
    signature: cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET,
    ),
  };
}

export function verifyDirectPdfUpload(payload = {}) {
  const {
    filename,
    fileHash,
    publicId,
    cloudinaryUrl,
    version,
    signature,
    bytes,
  } = payload;

  if (!filename || !PDF_HASH_PATTERN.test(fileHash || '')) {
    throw httpError(400, 'Invalid PDF upload metadata');
  }

  if (publicId !== `${UPLOAD_FOLDER}/pdf_${fileHash}`) {
    throw httpError(400, 'Cloudinary public ID does not match the uploaded PDF');
  }

  if (!Number.isSafeInteger(Number(version)) || !signature) {
    throw httpError(400, 'Missing Cloudinary upload verification data');
  }

  if (!Number.isFinite(Number(bytes)) || Number(bytes) <= 0 || Number(bytes) > MAX_PDF_BYTES) {
    throw httpError(400, 'PDF must be no larger than 50 MB');
  }

  let uploadedUrl;
  try {
    uploadedUrl = new URL(cloudinaryUrl);
  } catch {
    throw httpError(400, 'Invalid Cloudinary URL');
  }

  if (uploadedUrl.protocol !== 'https:' || uploadedUrl.hostname !== 'res.cloudinary.com') {
    throw httpError(400, 'Unexpected Cloudinary upload URL');
  }

  const expectedSignature = cloudinary.utils.api_sign_request(
    { public_id: publicId, version: Number(version) },
    process.env.CLOUDINARY_API_SECRET,
  );

  const expected = Buffer.from(expectedSignature);
  const received = Buffer.from(String(signature));
  if (expected.length !== received.length || !crypto.timingSafeEqual(expected, received)) {
    throw httpError(400, 'Cloudinary upload signature is invalid');
  }

  return {
    filename: String(filename).slice(0, 255),
    fileHash,
    publicId,
    cloudinaryUrl,
  };
}
