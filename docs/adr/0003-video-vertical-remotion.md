# ADR 0003 — Vídeos verticales 9:16 con Remotion

Fecha: 2026-11-24 · Estado: aceptada (prototipo)

## Contexto

La entrega incluye formatos 9:16 para Reels, TikTok y Shorts (arquitectura, paso 10). Se quiere un proyecto para crear vídeos verticales desde cero con plantillas de marca reutilizables y datos editables.

## Decisión

- Nuevo paquete `apps/video` con **Remotion 4** (React + TypeScript), versiones fijadas.
- Formato 1080×1920, 30 fps, H.264 yuv420p.
- Props validadas con **Zod** (`src/schema.ts`), compatibles con salidas estructuradas de Claude en el futuro (Claude propone el JSON de props; Remotion renderiza).
- Plantillas iniciales: `VerticalBase` (lienzo vacío) y `PropiedadVertical` (inmobiliaria).
- Guía de zonas seguras de las apps sociales.
- Sin fuentes ni recursos remotos: el render funciona sin conexión.

## Relación con la EDL + FFmpeg

La arquitectura prevé EDL en JSON ejecutada por FFmpeg para el montaje. Remotion se usa para piezas con gráficos animados (rótulos, precio, llamada a la acción). Queda por decidir en la Etapa 4 si el render final es solo FFmpeg, solo Remotion o mixto (FFmpeg monta, Remotion añade capa gráfica).

## Licencia (requiere atención del propietario)

Remotion es gratuito para personas, organizaciones sin fines de lucro y empresas con **hasta 3 empleados**. Las empresas más grandes, y el uso como parte de un SaaS que renderiza para terceros, pueden requerir **licencia de empresa de pago** (remotion.pro). No se ha contratado nada. Antes de la Etapa 6 (SaaS white-label) hay que verificar los términos vigentes y aprobar el coste o elegir alternativa (solo FFmpeg).

## Alternativas

- Solo FFmpeg (`drawtext`, `xfade`): gratis y ya previsto, pero las animaciones de texto y el diseño de marca son costosos de mantener.
- Editores de escritorio (CapCut, DaVinci): no automatizables desde la plataforma.
