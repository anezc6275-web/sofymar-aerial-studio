# Etapa 0 — Guía de prueba (Windows)

Objetivo: probar **gratis** la Estación de Dirección con el dron real.

## 1. Instalar (una sola vez)

1. **Node.js 22 LTS**: descargar de https://nodejs.org e instalar.
2. **Git**: https://git-scm.com/download/win
3. **Google Chrome** o **Microsoft Edge** (necesarios para la voz).
4. **Receptor AirPlay para Windows**: instalar uno con prueba gratuita para ver la pantalla del iPhone en la computadora. No comprar licencia todavía.
5. Abrir **PowerShell** y ejecutar:

```powershell
corepack enable
git clone https://github.com/anezc6275-web/sofymar-aerial-studio.git
cd sofymar-aerial-studio
pnpm install
copy .env.example .env
```

### Instalación rápida (un solo paso)

Abrir **PowerShell** y pegar este bloque completo. Instala Node.js, Git y Chrome, descarga el proyecto en *Documentos* y lo inicia. Git abrirá el navegador una vez para iniciar sesión en GitHub (el repositorio es privado).

```powershell
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
winget install -e --id Git.Git --accept-source-agreements --accept-package-agreements
winget install -e --id Google.Chrome --accept-source-agreements --accept-package-agreements
$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')
cd "$HOME\Documents"
git clone https://github.com/anezc6275-web/sofymar-aerial-studio.git
cd sofymar-aerial-studio
powershell -ExecutionPolicy Bypass -File scripts\windows\instalar.ps1
.\iniciar.bat
```

Las siguientes veces basta con **doble clic en `iniciar.bat`** (carpeta *Documentos\sofymar-aerial-studio*).

## 2. Iniciar

```powershell
pnpm dev
```

Abrir en Chrome/Edge: http://localhost:3000/estacion

La etiqueta **MODO SIMULADO (gratis)** indica que no se usa Claude ni se gasta dinero.

## 3. Prueba en campo

1. Conectar iPhone y computadora a la **misma red Wi-Fi** (router 4G o punto de acceso).
2. En el iPhone: Centro de control → **Duplicar pantalla** → elegir el receptor AirPlay de la computadora.
3. Abrir DJI Fly con el RC-N3 conectado.
4. En la Estación: **Capturar ventana** → elegir la ventana del receptor AirPlay.
5. Conectar auriculares Bluetooth a la computadora (para el piloto).
6. Probar: **Analizar ahora**, modo **Automático**, botón de voz (o barra espaciadora) con los comandos “hecha”, “repetir”, “siguiente”, “qué toma”.

## 4. Qué anotar (resultados de la prueba)

| Pregunta | Resultado |
|---|---|
| ¿DJI Fly se ve en la computadora por AirPlay? | |
| Retraso aproximado de la imagen (segundos) | |
| ¿El reconocimiento de voz entiende con viento? | |
| ¿La voz se oye bien en los auriculares? | |
| ¿Las métricas de exposición coinciden con lo que se ve? | |
| Receptor AirPlay usado | |

## 5. Inspeccionar archivos del DJI Flip (opcional)

Requiere **FFmpeg** instalado (https://www.gyan.dev/ffmpeg/builds/ y agregarlo al PATH):

```powershell
pnpm media:probe "C:\ruta\a\carpeta\de\videos" --frames 6
```

Muestra códec, resolución, fps, perfil de color y si hay telemetría .SRT, y extrae fotogramas de muestra en `media-local/frames`.

## 6. Activar Claude (de pago, solo cuando se decida)

La API de Anthropic **no es gratuita**: requiere comprar créditos. Cuando se apruebe:

1. Crear cuenta en https://console.anthropic.com, cargar un crédito pequeño y fijar un **límite de gasto**.
2. Crear una clave y pegarla en `.env` → `ANTHROPIC_API_KEY=...`
3. Ajustar `MAX_AI_CALLS_PER_DAY` (protección de gasto) y reiniciar `pnpm dev`.

Coste aproximado con Claude Opus 5.5: ~0,005–0,01 USD por fotograma analizado. Con análisis cada 5 s, unos 2–3 USD por cada 30 min de vuelo. Analizar solo bajo demanda (“analiza”) reduce mucho el coste.

## Anexo — Prueba con MacBook

La Mac recibe AirPlay **sin programas adicionales** (macOS 12 Monterey o posterior; Mac de 2018 en adelante aprox.).

```bash
# Si no tienes Node.js 22: instalar desde https://nodejs.org
corepack enable
git clone https://github.com/anezc6275-web/sofymar-aerial-studio.git
cd sofymar-aerial-studio
pnpm install
cp .env.example .env
pnpm dev
```

1. Ajustes del Sistema → General → AirDrop y Handoff → activar **Receptor AirPlay**.
2. iPhone y Mac en la misma red Wi-Fi. En el iPhone: Centro de control → **Duplicar pantalla** → la MacBook.
3. Abrir **Google Chrome** en http://localhost:3000/estacion → **Capturar ventana**.
   La primera vez macOS pedirá permiso de **Grabación de pantalla** para Chrome (Ajustes del Sistema → Privacidad y seguridad); concederlo y reabrir Chrome.
