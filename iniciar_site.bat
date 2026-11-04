@echo off
title Redacao ENEM - Sophie
chcp 65001 > nul
cls

echo =====================================================================
echo    PLATAFORMA DE REDAÇÃO ENEM • SOPHIE
echo =====================================================================
echo.
echo Iniciando a plataforma e gerando o link online para o celular...
echo.

cd /d "%~dp0"

if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" start.py
) else if exist "..\redacao-livia\.venv\Scripts\python.exe" (
    "..\redacao-livia\.venv\Scripts\python.exe" start.py
) else (
    python start.py
)

pause
