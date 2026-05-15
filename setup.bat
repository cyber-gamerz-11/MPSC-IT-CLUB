@echo off
echo Setting up MPSC IT CLUB Website...
echo.

:: Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Python is not installed or not in PATH.
    pause
    exit /b
)

:: Create Virtual Environment
echo Creating virtual environment (venv)...
python -m venv venv

:: Activate Virtual Environment
echo Activating virtual environment...
call venv\Scripts\activate

:: Install Dependencies
echo Installing requirements...
pip install -r requirements.txt

echo.
echo Setup Complete!
echo To run the server, use: run.bat
echo.
pause
