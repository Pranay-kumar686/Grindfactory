@echo off
echo ===============================================
echo   Grind Factory Gym Website Server Launcher
echo ===============================================
echo.
echo Before starting the server, make sure:
echo 1. MySQL Server is running
echo 2. You've created the database using database_setup.sql
echo 3. You've imported stored procedures from stored_procedures.sql
echo.
echo If you haven't set up the database yet:
echo - Open MySQL Workbench
echo - Execute database_setup.sql
echo - Execute stored_procedures.sql
echo.
echo Starting Node.js server on http://localhost:9000
echo Press Ctrl+C to stop the server
echo.
npm start
pause 