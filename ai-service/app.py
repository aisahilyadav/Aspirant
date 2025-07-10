from fastapi import FastAPI, Form
from fastapi import HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from pymongo import MongoClient
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_google_genai import ChatGoogleGenerativeAI 
from langchain.prompts import PromptTemplate
from langchain.chains.question_answering import load_qa_chain

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
print("[Init] Loaded GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))

# Choose your database and collection
db = client["self-learning-platform"]
pdfs = db["pdfs"]


app = FastAPI()

# Initialize embeddings once; vector DB will use this
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

@app.get("/")
async def root():
    return {"message": "FastAPI RAG microservice is running!"}

@app.get("/health")
async def health():
    return {"status": "ok"}

class ProcessRequest(BaseModel):
    file_hash: str
    signed_url: str

@app.post("/process_pdf")
async def process_pdf(req: ProcessRequest):
    file_hash = req.file_hash
    signed_url = req.signed_url
    print(f"[process_pdf] Received file_hash: {file_hash}")
    print(f"[process_pdf] Received signed_url: {signed_url}")

    # Debug: Check what's in the database
    print("[DEBUG] Checking database contents...")
    all_docs = list(pdfs.find({}))
    print(f"[DEBUG] Found {len(all_docs)} documents in pdfs collection")
    for doc in all_docs[:3]:  # Show first 3 docs
        print(f"[DEBUG] Doc: {doc}")


    # Lookup Cloudinary URL from MongoDB
    # Get the LATEST document (most recent upload)
    doc = pdfs.find_one({"fileHash": file_hash}, sort=[("createdAt", -1)])
    if not doc:
        return {"message": "File not found in DB", "file_exists": False}

    cloud_url = signed_url
    print(f"[process_pdf] Downloading PDF from: {cloud_url}")

    uploads_dir = "uploads"
    os.makedirs(uploads_dir, exist_ok=True)
    local_pdf_path = os.path.join(uploads_dir, f"{file_hash}.pdf")


    # Check if vector store already exists
    index_dir = f"faiss_indexes/{file_hash}"
    if os.path.exists(index_dir):
        print("[process_pdf] PDF already processed. Vector store exists.")
        return {"message": "PDF already processed! You can start chatting now."}

    # Download PDF if not cached locally
    if not os.path.exists(local_pdf_path):
        print(f"[process_pdf] Downloading PDF from Cloudinary: {cloud_url}")
        import requests
        response = requests.get(cloud_url)
        response.raise_for_status()
        with open(local_pdf_path, "wb") as f:
            f.write(response.content)
    else:
        print("[process_pdf] PDF already cached locally.")

         # Process the PDF (this was indented incorrectly before)
    print("[process_pdf] Extracting text...")
    text = extract_text_from_pdf(local_pdf_path)
    
    if not text.strip():
        print("[process_pdf] No text extracted from PDF!")
        return {"message": "Failed to extract text from PDF", "file_exists": True}

    print(f"[process_pdf] Extracted {len(text)} characters of text")
    print("[process_pdf] Splitting text...")
    chunks = split_text(text)
    print(f"[process_pdf] Created {len(chunks)} text chunks")

    print("[process_pdf] Saving vector store...")
    save_vector_store(chunks, file_hash)

    print("[process_pdf] Done!")
    return {"message": "PDF processed successfully! You can start chatting now."}

class QuestionRequest(BaseModel):
    question: str
    file_hash: str

@app.post("/chat")
async def chat(req: QuestionRequest):
    print(f"[chat] Received question: {req.question}")
    try:
        answer = answer_question(req.question, req.file_hash)

        print("[chat] Answer generated")
        return {"answer": answer}
    except Exception as e:
        print("[chat] Error:", e)
        return {"answer": " Failed to get answer", "error": str(e)}

# -----------------------------
# 📦 Helper functions
# -----------------------------

def extract_text_from_pdf(pdf_path):
    text = ""
    reader = PdfReader(pdf_path)
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text

def split_text(text):
    splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    return splitter.split_text(text)

def save_vector_store(chunks, file_hash):
    index_dir = f"faiss_indexes/{file_hash}"
    os.makedirs(index_dir, exist_ok=True)
    store = FAISS.from_texts(chunks, embedding=embeddings)
    store.save_local(index_dir)
    print(f"[save_vector_store] Vector store saved to {index_dir}")


def answer_question(question, file_hash):
    index_dir = f"faiss_indexes/{file_hash}"
    print(f"[answer_question] Loading vector store from {index_dir}...")
    if not os.path.exists(index_dir):
        print("[answer_question] Index not found!")
        return "PDF is still processing. Try again later."
    db = FAISS.load_local(index_dir, embeddings, allow_dangerous_deserialization=True)

    docs = db.similarity_search(question)

    print("[answer_question] Initializing LLM...")
    model = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0.3)

    prompt_template = """
    Answer the question as detailed as possible from the provided context.
    If answer not in context, say "answer is not available in the context."

    Context:
    {context}

    Question:
    {question}

    Answer:
    """
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])

    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)

    print("[answer_question] Running chain...")
    result = chain({"input_documents": docs, "question": question}, return_only_outputs=True)

    return result['output_text']

@app.get("/debug/pdfs")
async def debug_pdfs():
    docs = list(pdfs.find({}).limit(10))
    return {"count": len(docs), "docs": docs}


class QuizRequest(BaseModel):
    file_hash: str
    topic: str
    num_questions: int


#----------------------------------------------------------#

@app.post("/generate_quiz")
async def generate_quiz(req: QuizRequest):
    index_dir = f"faiss_indexes/{req.file_hash}"
    if not os.path.exists(index_dir):
        raise HTTPException(status_code=400, detail="PDF not processed yet.")

    # Load vector store & get context
    db = FAISS.load_local(index_dir, embeddings, allow_dangerous_deserialization=True)
    docs = db.similarity_search(req.topic, k=10)
    context = "\n".join([doc.page_content for doc in docs])

    # Prompt
    prompt_template = PromptTemplate(
        template="""
Based on the context below, generate {num_questions} multiple-choice quiz questions about the topic "{topic}".
Each question must include:
- 'question' (string)
- 'options' (list of 4 strings)
- 'correctAnswer' (string, must be EXACTLY one of the options)

Return ONLY a valid JSON array, like:
[
  {{"question": "...", "options": ["a","b","c","d"], "correctAnswer": "a"}},
  ...
]

Context:
{context}
""",
        input_variables=["num_questions", "topic", "context"]
    )

    # LLM
    model = ChatGoogleGenerativeAI(model="gemini-2.5-pro", temperature=0.3)

    # Compose chain: prompt | llm
    chain = prompt_template | model

    print("[generate_quiz] Generating quiz...")

    # Call invoke with proper dict
    result = chain.invoke({
        "num_questions": str(req.num_questions),
        "topic": req.topic,
        "context": context
    })

    # Gemini returns `result` as a string sometimes inside an object; adjust if needed
    raw_output = result if isinstance(result, str) else getattr(result, 'content', str(result))
    print("[generate_quiz] Raw LLM result:", raw_output)

    # Clean markdown ```json
    cleaned = raw_output.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[len("```json"):].strip()
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3].strip()

    # Parse JSON
    import json
    try:
        questions = json.loads(cleaned)
        print(f"[generate_quiz] Parsed {len(questions)} questions")
    except json.JSONDecodeError as e:
        print("[generate_quiz] JSON decode error:", e)
        raise HTTPException(status_code=500, detail="Failed to parse quiz JSON")

    return {"questions": questions}
