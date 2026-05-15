@echo off
echo Starting MPSC IT CLUB Website...
echo.

:: Activate Virtual Environment
if exist venv\Scripts\activate (
    call venv\Scripts\activate
) else (
    echo Virtual environment not found. Please run setup.bat first.
    pause
    exit /b
)

:: Run the server from the root directory
python run_server.py

pause
