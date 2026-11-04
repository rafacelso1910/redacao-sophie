@echo off
title Stairway to 1000 - Publicar Online para Celular
chcp 65001 > nul
cls

echo =====================================================================
echo    STAIRWAY TO 1000 • PUBLICAR SITE ONLINE PARA O CELULAR DA SOPHIE
echo =====================================================================
echo.
echo Iniciando servidor e gerando link publico HTTPS...
echo.

cd /d "%~dp0"

if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" start.py
) else (
    python start.py
)

pause
