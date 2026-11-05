@echo off
REM Inicia Sofymar Aerial Studio y abre la Estacion de Direccion cuando este lista.
cd /d "%~dp0"
start "" /min powershell -NoProfile -Command "for($i=0;$i -lt 120;$i++){ try { Invoke-WebRequest http://localhost:3000/estacion -UseBasicParsing -TimeoutSec 3 | Out-Null; Start-Process http://localhost:3000/estacion; break } catch { Start-Sleep 2 } }"
npx --yes pnpm@10.28.0 dev
echo.
echo Sofymar se detuvo. Copia el texto de arriba y envialo a Claude.
pause
