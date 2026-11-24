# @sofymar/video — Vídeos verticales 9:16 con Remotion

Plantillas de vídeo en React para Reels, TikTok, YouTube Shorts y Stories.
Formato: **1080×1920, 30 fps, H.264 (yuv420p)**.

## Uso

Desde la raíz del monorepo:

```bash
pnpm install
pnpm video            # abre Remotion Studio en http://localhost:3000
pnpm video:render     # genera apps/video/out/propiedad-vertical.mp4
```

> Si `pnpm dev` (web) ya ocupa el puerto 3000, el Studio usará el siguiente libre.

Dentro de `apps/video`:

```bash
pnpm studio
pnpm render                       # PropiedadVertical → out/propiedad-vertical.mp4
pnpm render:demo                  # VerticalBase → out/vertical-base.mp4
pnpm still                        # fotograma de portada → out/portada.png
npx remotion render src/index.ts PropiedadVertical out/casa.mp4 --props=./datos/casa.json
```

La primera vez que se renderiza, Remotion descarga su propio Chrome Headless Shell.

## Composiciones

| ID | Para qué |
|---|---|
| `VerticalBase` | Lienzo vacío 9:16 con guía de zonas seguras. Punto de partida para un vídeo nuevo desde cero. |
| `PropiedadVertical` | Plantilla inmobiliaria: intro (título, zona) → tomas con rótulo y transiciones → cierre (precio, características, llamada a la acción, marca). La duración se calcula sola según las tomas. |

Las props se validan con Zod (`src/schema.ts`) y se pueden editar en vivo en el panel derecho del Studio.

## Usar material propio

1. Copiar clips/fotos a `apps/video/public/` (p. ej. `public/clips/fachada.mp4`). Esa carpeta no se sube a git si el material es pesado: añadirlo a `.gitignore` según convenga.
2. En las props, `fuente: "clips/fachada.mp4"`, `tipo: "video"`, `inicioSegundos` para recortar el inicio.
3. Los clips horizontales 16:9 del DJI Flip se recortan al centro (`object-fit: cover`). Para vertical nativo, grabar en modo vertical en DJI Fly.
4. Música: solo pistas con licencia comercial (`musica: "musica/pista.mp3"`). Ver riesgos en `docs/arquitectura.md`.

## Zonas seguras

`mostrarZonasSeguras: true` dibuja en rojo las áreas que tapa la interfaz de las apps (arriba 250 px, abajo 420 px, derecha 160 px). Mantener textos y logos dentro del recuadro verde. Valores en `src/constantes.ts`.

## Estructura

```
src/
  index.ts              registerRoot
  Root.tsx              registro de composiciones
  constantes.ts         tamaño, fps, zonas seguras
  schema.ts             esquemas Zod de las props
  ejemplo.ts            datos de muestra
  composiciones/        VerticalBase, PropiedadVertical
  escenas/              Intro, EscenaToma, Cierre
  componentes/          Medio (clip/foto con zoom), ZonasSeguras, tipografía
remotion.config.ts      códec y calidad de salida
```

## Licencia de Remotion

Remotion no es software libre para todas las empresas: es gratuito para personas y empresas de **hasta 3 empleados**; a partir de ahí requiere licencia de empresa. Ver ADR 0003.
