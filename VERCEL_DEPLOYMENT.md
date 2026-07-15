# Deploying the Express API to Vercel

The browser now uploads PDFs directly to Cloudinary. The Express API only signs the upload, verifies Cloudinary's response, stores metadata in MongoDB, and asks the separately deployed FastAPI service to process the uploaded document.

## Vercel project

1. Import this repository into Vercel.
2. Set the project's root directory to `server`.
3. Keep the detected Express framework settings and deploy.
4. Add every variable listed in `server/.env.example` to the Vercel project.

`CLIENT_ORIGINS` is a comma-separated allowlist. Include the production frontend URL and any preview frontend URL that should call the API. Do not put a trailing slash on an origin.

`RAG_SERVICE_URL` must be the public HTTPS base URL of the FastAPI service on AWS. It must not end in a slash.

## Frontend project

Set `VITE_API_URL` to the deployed Vercel API origin, without a trailing slash, then rebuild and redeploy the frontend.

## Cloudinary

No unsigned upload preset is required. The authenticated user requests a short-lived signature from Express, then uploads directly to Cloudinary using that signature. The Cloudinary API secret never reaches the browser.

The current maximum PDF size is 50 MB. Update both `server/src/services/directUpload.service.js` and `client/src/api/directUpload.js` if that limit changes.
