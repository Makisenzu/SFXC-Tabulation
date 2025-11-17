@echo off
title SFXC Tabulation - System Status Check
color 0A
echo.
echo ===============================================================================
echo    SFXC TABULATION SYSTEM - STATUS CHECK
echo ===============================================================================
echo.

echo [1/5] Checking Network Configuration...
echo.
echo Your IP Addresses:
ipconfig | findstr /C:"IPv4"
echo.

echo [2/5] Checking if ports are available...
echo.
netstat -an | findstr ":8000" >nul
if %errorlevel% equ 0 (
    echo ❌ Port 8000 is IN USE - Laravel may already be running
) else (
    echo ✅ Port 8000 is AVAILABLE
)

netstat -an | findstr ":8080" >nul
if %errorlevel% equ 0 (
    echo ❌ Port 8080 is IN USE - Reverb may already be running
) else (
    echo ✅ Port 8080 is AVAILABLE
)
echo.

echo [3/5] Checking PHP installation...
php -v 2>nul
if %errorlevel% neq 0 (
    echo ❌ PHP not found in PATH
) else (
    echo ✅ PHP is installed
)
echo.

echo [4/5] Checking Node.js installation...
node -v 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js not found in PATH
) else (
    echo ✅ Node.js is installed
)
echo.

echo [5/5] Checking configuration files...
if exist ".env" (
    echo ✅ .env file exists
    findstr "APP_URL=http://192.168.1.45:8000" .env >nul
    if %errorlevel% equ 0 (
        echo ✅ APP_URL configured correctly
    ) else (
        echo ⚠️ APP_URL may need updating
    )
    
    findstr "REVERB_HOST=\"192.168.1.45\"" .env >nul
    if %errorlevel% equ 0 (
        echo ✅ REVERB_HOST configured correctly
    ) else (
        echo ⚠️ REVERB_HOST may need updating
    )
) else (
    echo ❌ .env file not found
)
echo.

if exist "start-all.bat" (
    echo ✅ Startup scripts are ready
) else (
    echo ❌ Startup scripts not found
)
echo.

echo ===============================================================================
echo    FIREWALL STATUS
echo ===============================================================================
echo.
echo Checking firewall rules for SFXC Tabulation...
netsh advfirewall firewall show rule name="SFXC Tabulation - Laravel" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Firewall rule for Laravel exists
) else (
    echo ⚠️ Firewall rule for Laravel NOT FOUND
    echo    Run: configure-firewall.bat as Administrator
)

netsh advfirewall firewall show rule name="SFXC Tabulation - Reverb" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Firewall rule for Reverb exists
) else (
    echo ⚠️ Firewall rule for Reverb NOT FOUND
    echo    Run: configure-firewall.bat as Administrator
)
echo.

echo ===============================================================================
echo    SYSTEM READY STATUS
echo ===============================================================================
echo.
echo If all checks show ✅, you're ready to start!
echo.
echo Next step: Double-click start-all.bat
echo.
echo ===============================================================================
pause
