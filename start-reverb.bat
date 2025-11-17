@echo off
echo ===============================================
echo Starting Reverb WebSocket Server
echo Broadcasting on 192.168.1.45:8080
echo ===============================================
echo.

echo Starting Reverb Server...
php artisan reverb:start --host=192.168.1.45 --port=8080 --debug

pause
