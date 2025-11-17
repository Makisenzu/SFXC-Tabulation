@echo off
echo ===============================================
echo Starting SFXC Tabulation System
echo Local Network IP: 192.168.1.45:8000
echo ===============================================
echo.

echo Starting Laravel Server on 192.168.1.45:8000...
start "Laravel Server" cmd /k "php artisan serve --host=192.168.1.45 --port=8000"

timeout /t 3 /nobreak >nul

echo.
echo ===============================================
echo Servers Started Successfully!
echo.
echo Laravel Server: http://192.168.1.45:8000
echo.
echo Press any key to stop all servers...
echo ===============================================
pause >nul

echo.
echo Stopping servers...
taskkill /FI "WindowTitle eq Laravel Server*" /T /F >nul 2>&1

echo.
echo All servers stopped.
pause
