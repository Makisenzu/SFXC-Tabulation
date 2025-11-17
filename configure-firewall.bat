@echo off
echo ===============================================
echo Configuring Windows Firewall for SFXC Tabulation
echo ===============================================
echo.
echo This will add firewall rules to allow:
echo - Port 8000 (Laravel Server)
echo - Port 8080 (Reverb WebSocket)
echo.
echo You need to run this script as Administrator!
echo.
pause

echo.
echo Adding firewall rule for Laravel (Port 8000)...
netsh advfirewall firewall add rule name="SFXC Tabulation - Laravel" dir=in action=allow protocol=TCP localport=8000

echo.
echo Adding firewall rule for Reverb WebSocket (Port 8080)...
netsh advfirewall firewall add rule name="SFXC Tabulation - Reverb" dir=in action=allow protocol=TCP localport=8080

echo.
echo ===============================================
echo Firewall rules added successfully!
echo ===============================================
echo.
echo You can now access the application from other devices on your network:
echo http://192.168.1.45:8000
echo.
pause
