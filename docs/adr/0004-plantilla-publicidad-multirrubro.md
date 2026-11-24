# ADR 0004 — Plantilla de publicidad vertical multirrubro

Fecha: 2026-11-24 · Estado: aceptada (prototipo)

## Contexto

Además de inmuebles, se quiere producir anuncios verticales para clientes de cualquier rubro (gastronomía, salud, deporte, comercio…), con vídeo, textos animados, motion graphics, efectos de sonido, música, imágenes de apoyo y logo, reutilizando el mismo código para todos.

## Decisión

- Nueva composición `PublicidadVertical` en `apps/video`, **dirigida por datos**: tema de marca + lista de escenas tipadas (`portada`, `medio`, `texto`, `galeria`, `beneficios`, `cifra`, `oferta`, `cierre`). La duración total se calcula sola.
- La **identidad del cliente** (`tema`) es independiente del contenido: colores, fuentes, logo, ritmo de animación y estilo de resaltado. Las marcas viven en `src/clientes/marcas.ts` o en el JSON de cada anuncio.
- **Esquemas Zod puros** (`comun/esquemas.ts`, `comun/tema.ts`, `publicidad/schema.ts`) sin dependencias de React, para validar en el Studio, en el render por lotes y, más adelante, las propuestas estructuradas de Claude (Claude propone el JSON; Zod valida; Remotion renderiza).
- **Render por lotes** (`scripts/render-lote.ts`): un JSON por pieza en `datos/`; valida todo antes de renderizar.
- **Transiciones solo CSS** (sin las de WebGL de `@remotion/transitions`) para que el render funcione en cualquier equipo.
- **Fuentes OFL empaquetadas** (`@fontsource`) y **audio sintetizado** en el repositorio (`scripts/generar-sonidos.py`): render sin internet y sin licencias de terceros.
- La plantilla inmobiliaria `PropiedadVertical` se mantiene sin cambios.

## Pendiente

- Música real: sigue pendiente elegir una biblioteca con licencia comercial (ver Riesgos en `docs/arquitectura.md`). La pista incluida es solo de demostración.
- Otros formatos (1:1, 4:5, 16:9): la plantilla está pensada para 9:16; adaptar la maquetación si se necesitan.
- Integrar con la API: generación de props por Claude (registrando cada llamada en `ai_interactions`) y render en el worker.
