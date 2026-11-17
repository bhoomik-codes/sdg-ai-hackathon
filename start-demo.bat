@echo off
setlocal
cd /d "%~dp0"
title Commons - Hackathon Demo
if not exist node_modules\vite\bin\vite.js (
  echo Installing Commons dependencies for the first run...
  call npm install
  if errorlevel 1 goto failed
)
echo Starting Commons in demo mode...
echo Sample campuses and community organisations will be loaded.
echo Open the local address printed below. Press Ctrl+C to stop.
call npm run dev:demo -- --host 0.0.0.0
if errorlevel 1 goto failed
goto end
:failed
echo.
echo Commons could not start. Check that Node.js and npm are installed.
pause
:end
endlocal
