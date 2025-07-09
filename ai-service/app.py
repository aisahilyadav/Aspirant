from fastapi import FastAPI, Form
import os

app = FastAPI()

@app.post("/process_pdf")
async def process_pdf(pdf_path: str = Form(...)):
    # 1. Log to console
    print(f"[process_pdf] Received path: {pdf_path}")

    # 2. Check file existence
    exists = os.path.exists(pdf_path)
    print(f"[process_pdf] File exists? {exists}")

    # 3. Return a simple JSON so the caller can see it immediately
    return {
        "received_path": pdf_path,
        "file_exists": exists,
        "message": "PDF processed successfully",
    }

@app.get("/health")
async def health():
    return {"status": "ok"}
