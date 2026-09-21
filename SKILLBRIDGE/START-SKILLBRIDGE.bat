@echo off
cd /d "%~dp0"
title SkillBridge Server
echo.
echo Starting SkillBridge...
echo Keep this window OPEN while you use the website.
echo.
npm run dev
echo.
echo Server stopped. Press any key to close.
pause >nul
