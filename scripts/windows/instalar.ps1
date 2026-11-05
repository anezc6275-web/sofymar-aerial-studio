# Instala las dependencias del proyecto en Windows (ejecutar desde cualquier carpeta).
$ErrorActionPreference = 'Stop'
$raiz = Resolve-Path (Join-Path $PSScriptRoot '..\..')
Set-Location $raiz
if (-not (Test-Path '.env')) { Copy-Item '.env.example' '.env' }
Write-Host 'Instalando dependencias (puede tardar unos minutos)...'
npx --yes pnpm@10.28.0 install
Write-Host ''
Write-Host 'Listo. Para iniciar: doble clic en iniciar.bat' -ForegroundColor Green
