@echo off
echo ===============================================
echo Starting SFXC Tabulation System (Full Stack)
echo Local Network IP: 192.168.1.45
echo ===============================================
echo.

echo [1/2] Starting Reverb WebSocket Server...
start "Reverb Server" cmd /k "php artisan reverb:start --host=192.168.1.45 --port=8080 --debug"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Laravel Application Server...
start "Laravel Server" cmd /k "php artisan serve --host=192.168.1.45 --port=8000"

timeout /t 2 /nobreak >nul

echo.
echo ===============================================
echo All Servers Started Successfully!
echo ===============================================
echo.
echo Laravel Application: http://192.168.1.45:8000
echo Reverb WebSocket:    ws://192.168.1.45:8080
echo.
echo IMPORTANT NOTES:
echo - Make sure Windows Firewall allows ports 8000 and 8080
echo - Other devices on the network can access via http://192.168.1.45:8000
echo - Real-time broadcasting is enabled
echo.
echo Press any key to stop all servers...
echo ===============================================
pause >nul

echo.
echo Stopping all servers...
taskkill /FI "WindowTitle eq Laravel Server*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Reverb Server*" /T /F >nul 2>&1

echo.
echo All servers stopped.
pause
