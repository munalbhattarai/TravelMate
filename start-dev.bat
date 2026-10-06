@echo off
title TravelMate Fullstack Platform
echo ========================================================
echo   Starting TravelMate Nepal (Django + Vite)
echo ========================================================
echo.

echo [1/2] Starting Django REST Backend on http://127.0.0.1:8000 ...
start "TravelMate Backend (Port 8000)" /D "%~dp0backend" cmd /k "venv\Scripts\activate && python manage.py runserver 127.0.0.1:8000"

echo [2/2] Starting Vite Frontend on http://localhost:5173 ...
start "TravelMate Frontend (Port 5173)" /D "%~dp0frontend" cmd /k "npm run dev"

echo.
echo Both services launched successfully!
echo Open your browser at http://localhost:5173
echo ========================================================
