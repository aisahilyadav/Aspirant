import cloudinary from './cloudinary.js';

export function generateSignedPdfUrl(publicId) {
  const signedUrl = cloudinary.utils.private_download_url(
    publicId,            // e.g. 'pdfs/pdf_fd0a13c...'
    'pdf',               // format extension
    {
      resource_type: 'raw',
      type: 'authenticated',
      expires_at: Math.floor(Date.now() / 1000) + 3600  // valid for 1 hour
    }
  );
  return signedUrl;
}
