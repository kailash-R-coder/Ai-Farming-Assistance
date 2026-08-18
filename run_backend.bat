@echo off
echo ===================================================
echo Starting AI-Powered Personal Farming Assistant Backend
echo ===================================================
cd backend
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing dependencies...
pip install -r requirements.txt
echo.
echo Starting FastAPI Uvicorn Server at http://127.0.0.1:8000 ...
echo Interactive Swagger Documentation at http://127.0.0.1:8000/docs
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause
