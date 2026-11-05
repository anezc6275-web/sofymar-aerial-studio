@echo off
REM Inicia Sofymar Aerial Studio y abre la Estacion de Direccion en el navegador.
cd /d "%~dp0"
start "" cmd /c "timeout /t 15 >nul && start http://localhost:3000/estacion"
npx --yes pnpm@10.28.0 dev
