from fastapi import FastAPI, Form
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.prompts import PromptTemplate
from langchain.chains.question_answering import load_qa_chain

load_dotenv()
print("[Init] Loaded GOOGLE_API_KEY:", os.getenv("GOOGLE_API_KEY"))



app = FastAPI()

# Initialize embeddings once; vector DB will use this
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

@app.get("/")
async def root():
    return {"message": "FastAPI RAG microservice is running!"}

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/process_pdf")
async def process_pdf(pdf_path: str = Form(...)):
    print(f"[process_pdf] Received path: {pdf_path}")

    exists = os.path.exists(pdf_path)
    print(f"[process_pdf] File exists? {exists}")
    if not exists:
        return {"message": "File does not exist", "file_exists": False}

    try:
        print("[process_pdf] Extracting text...")
        text = extract_text_from_pdf(pdf_path)

        print("[process_pdf] Splitting text into chunks...")
        chunks = split_text(text)

        print("[process_pdf] Saving vector store...")
        save_vector_store(chunks)

        print("[process_pdf] Done!")
        return {"message": " PDF processed successfully! You can start chatting now."}
    except Exception as e:
        print("[process_pdf] Error:", e)
        return {"message": " Failed to process PDF", "error": str(e)}

class QuestionRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(req: QuestionRequest):
    print(f"[chat] Received question: {req.question}")
    try:
        answer = answer_question(req.question)
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

def save_vector_store(chunks):
    store = FAISS.from_texts(chunks, embedding=embeddings)
    store.save_local("faiss_index")
    print("[save_vector_store] Vector store saved to faiss_index")

def answer_question(question):
    print("[answer_question] Loading vector store...")
    db = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)
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