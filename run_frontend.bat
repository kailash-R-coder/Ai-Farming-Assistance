@echo off
echo ===================================================
echo Starting AI-Powered Personal Farming Assistant Frontend
echo ===================================================
cd frontend
if not exist "node_modules" (
    echo Installing npm dependencies...
    npm install
)
echo.
echo Starting Vite Dev Server at http://localhost:5173 ...
npm run dev
pause
