@echo off
setlocal
cd /d "%~dp0"
title Commons - Production Preview
if not exist node_modules\vite\bin\vite.js (
  echo Installing Commons dependencies for the first run...
  call npm install
  if errorlevel 1 goto failed
)
echo Building the clean production version...
call npm run build:production
if errorlevel 1 goto failed
echo.
echo Starting the production preview. This build starts empty and needs an API backend for shared data.
echo Open the local address printed below. Press Ctrl+C to stop.
call npm run preview -- --host 0.0.0.0
if errorlevel 1 goto failed
goto end
:failed
echo.
echo Production preview could not start. Check the output above and confirm Node.js and npm are installed.
pause
:end
endlocal
