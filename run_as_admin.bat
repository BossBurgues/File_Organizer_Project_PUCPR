@echo off
:: SEÇÃO 1: Solicitar Elevação para Administrador
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Solicitando privilegios de Administrador para continuar...
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)
:: SEÇÃO 2: Lógica de Inicialização
pushd "%~dp0"
title Runner do Organizador de Arquivos (MODO ADMINISTRADOR)
cls
echo ====================================================================
echo.
echo      SCRIPT INICIADO COM PRIVILEGIOS DE ADMINISTRADOR
echo.
echo ====================================================================
echo.
echo Verificando a estrutura do projeto...
IF NOT EXIST ".\\backend\\venv" (
    echo [ERRO] A pasta de ambiente virtual 'venv' nao foi encontrada em 'backend'.
    goto FIM
)
echo Estrutura OK. Iniciando servidores...
echo.
echo [1/2] Iniciando servidor Backend (FastAPI/Uvicorn)...
start "Backend Server (Admin)" cmd /k "cd backend && call .\\venv\\Scripts\\activate.bat && uvicorn main:app --reload --port 8000"
echo [2/2] Iniciando servidor Frontend (React/Vite)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"
echo.
echo Aguardando 5 segundos para os servidores...
timeout /t 5 /nobreak > nul
echo Abrindo aplicacao no navegador...
start http://localhost:5173
echo.
echo TUDO PRONTO!
:FIM
popd
pause