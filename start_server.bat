@echo off
title Vietjet Travel Local Server
cd /d "%~dp0"
echo ===================================================
echo   DANG KHOI CHAY LOCAL SERVER CHO VIETJET TRAVEL
echo   Thu muc: %cd%
echo   Dia chi : http://localhost:8000
echo ===================================================
start http://localhost:8000
python -m http.server 8000
pause
