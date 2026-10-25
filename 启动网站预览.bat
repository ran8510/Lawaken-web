@echo off
setlocal
cd /d "%~dp0"
set "PORT=8766"
set "URL=http://127.0.0.1:%PORT%/product.html"
set "CODEX_PY=C:\Users\Ran\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"

echo Starting Lawaken website preview...
echo Keep this window open while viewing the website.
echo.

start "" powershell.exe -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Milliseconds 900; Start-Process '%URL%'"

if exist "%CODEX_PY%" (
  "%CODEX_PY%" -m http.server %PORT% --bind 127.0.0.1
  if errorlevel 1 pause
  goto :end
)

py.exe -3 -c "import sys" >nul 2>nul
if not errorlevel 1 (
  py.exe -3 -m http.server %PORT% --bind 127.0.0.1
  if errorlevel 1 pause
  goto :end
)

python.exe -c "import sys" >nul 2>nul
if not errorlevel 1 (
  python.exe -m http.server %PORT% --bind 127.0.0.1
  if errorlevel 1 pause
  goto :end
)

echo Python 3 was not found.
pause

:end
endlocal
