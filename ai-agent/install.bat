@echo off
echo Installing AI Agent dependencies...
pip install fastapi uvicorn python-dotenv langchain langchain-groq langchain-core supabase pydantic
echo.
echo Done! Now edit .env and add your GROQ_API_KEY, then run start.bat
pause
