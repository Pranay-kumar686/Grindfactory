@echo off
echo ===============================================
echo   Grind Factory Gym Database Setup Guide
echo ===============================================
echo.
echo This guide will help you set up the MySQL database.
echo.
echo Steps to follow:
echo 1. Make sure MySQL Server is installed and running
echo 2. Open MySQL Workbench
echo 3. Connect to your local MySQL server
echo 4. Open and execute database_setup.sql
echo 5. Open and execute stored_procedures.sql
echo.
echo After completing these steps, your database will be ready.
echo You can then run start.bat to launch the Grind Factory server.
echo.
echo Press any key to open the directory with the SQL files...
pause > nul
explorer .
echo.
echo Setup guide completed. You can now proceed with the database setup.
pause 