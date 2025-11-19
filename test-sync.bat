@echo off
echo ====================================
echo SFXC Tabulation - Testing Sync Setup
echo ====================================
echo.

echo Testing connection to online server...
echo.

curl -X POST https://sfxcresults.online/api/sync/receive ^
  -H "Authorization: Bearer sfxc_secure_api_key_2024" ^
  -H "Content-Type: application/json" ^
  -H "Accept: application/json" ^
  -d "{\"data\":{\"events\":[],\"contestants\":[],\"criteria\":[],\"actives\":[],\"rounds\":[],\"tabulations\":[],\"users\":[],\"assigns\":[],\"medal_tallies\":[],\"medal_participants\":[],\"medal_scores\":[]}}" ^
  --max-time 30 ^
  --verbose

echo.
echo ====================================
echo Test Complete
echo ====================================
echo.
echo If you see "success: true", the sync is working!
echo If you get an error, check:
echo 1. Internet connection
echo 2. Online server is running
echo 3. API key matches on both servers
echo.
pause
