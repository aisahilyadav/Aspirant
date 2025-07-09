//server and client
npm run dev


//activate virtual environment in windows
.\venv\Scripts\activate

//run fastapi server
uvicorn app:app --reload
//run fastapi server with specific port
uvicorn app:app --reload --port 8000