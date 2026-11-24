# @sofymar/video — Vídeos verticales 9:16 con Remotion

Plantillas de vídeo en React para Reels, TikTok, YouTube Shorts y Stories.
Formato: **1080×1920, 30 fps, H.264 (yuv420p) + audio AAC**.

Todo se controla con **datos** (props validadas con Zod): el mismo código sirve para cualquier cliente y rubro.

## Uso rápido

Desde la raíz del monorepo:

```bash
pnpm install
pnpm video                # Remotion Studio (vista previa y edición de props en vivo)
pnpm video:render         # plantilla de publicidad → apps/video/out/publicidad-vertical.mp4
pnpm video:inmobiliaria   # plantilla inmobiliaria → apps/video/out/propiedad-vertical.mp4
pnpm video:lote           # todos los anuncios definidos en apps/video/datos/*.json
```

La primera vez que se renderiza, Remotion descarga su propio Chrome Headless Shell.
Para usar un Chrome ya instalado en el render por lotes: variable `REMOTION_NAVEGADOR=/ruta/a/chrome`.

## Composiciones

| Carpeta en el Studio | ID | Para qué |
|---|---|---|
| Publicidad | `PublicidadVertical` | **Plantilla genérica de publicidad** con los 8 tipos de escena y textos de relleno. |
| Publicidad › Ejemplos-por-rubro | `Publicidad-Cafeteria`, `Publicidad-Gimnasio`, `Publicidad-Clinica` | La misma plantilla con tres marcas y estilos distintos. |
| Inmobiliaria | `PropiedadVertical` | Plantilla inmobiliaria (intro → tomas del dron → precio y contacto). |
| Base | `VerticalBase` | Lienzo vacío 9:16 para experimentar desde cero. |

## Plantilla de publicidad

Un anuncio = **tema de marca** + **lista de escenas** + música + efectos.

### Tema (identidad del cliente)

Definido una vez en `src/clientes/marcas.ts` (o en el JSON) y reutilizado en todos sus anuncios:

| Campo | Ejemplo | Nota |
|---|---|---|
| `nombreMarca` | `"Aroma Café"` | Se usa como logotipo de texto si no hay logo |
| `logo` | `"logos/aroma.png"` | En `public/`. PNG/SVG con fondo transparente |
| `colorPrimario`, `colorSecundario`, `colorFondo`, `colorTexto` | `"#E0A458"` | Hexadecimal |
| `fuenteTitulos`, `fuenteTexto` | `montserrat`, `inter`, `bebas`, `playfair` | Fuentes OFL incluidas, sin internet |
| `ritmo` | `suave` / `dinamico` | Animaciones fluidas o con rebote |
| `estiloDestacado` | `color` / `marcador` / `subrayado` | Cómo se resaltan las `*palabras entre asteriscos*` |
| `mayusculasTitulos` | `true` | |

### Escenas

Campos comunes: `duracionSegundos`, `transicion`, `sonido`, `fondo`.

| `tipo` | Contenido | Campos principales |
|---|---|---|
| `portada` | Gancho inicial: etiqueta, titular animado, subtítulo | `etiqueta`, `titular`, `subtitulo`, `animacion`, `posicion`, `alineacion` |
| `medio` | Vídeo o foto a pantalla completa con rótulo | `texto`, `subtexto`, `posicion` |
| `texto` | Tipografía cinética, línea a línea | `lineas[]`, `animacion`, `tamano` |
| `galeria` | Imágenes de apoyo | `imagenes[]`, `disposicion`: `mosaico` / `cuadricula` / `carrusel` |
| `beneficios` | Lista con iconos y sonido por elemento | `titulo`, `items[{icono, texto}]`, `sonidoPorItem` |
| `cifra` | Contador animado con anillo | `valor`, `prefijo`, `sufijo`, `decimales`, `texto` |
| `oferta` | Sello de descuento, precio tachado y precio nuevo | `etiqueta`, `titulo`, `precioAnterior`, `precio`, `nota` |
| `cierre` | Revelado del logo, eslogan, botón y contacto | `eslogan`, `llamadaAccion`, `contacto`, `redes[]` |

**Fondo de cada escena** (`fondo`): `fuente` (vídeo `.mp4/.mov/.webm` o imagen en `public/`; vacío = fondo animado de motion graphics con los colores de la marca), `movimiento` (`acercar`, `alejar`, `paneoIzquierda`, `paneoDerecha`, `subir`, `bajar`, `ninguno`), `inicioSegundos`, `oscurecer` (0–1) y `volumen` del audio original.

**Animaciones de texto**: `palabras`, `letras`, `deslizar`, `maquina`, `escala`, `desenfoque`, `aparecer`.

**Transiciones** (suaves, sin WebGL): `fundido`, `deslizar`, `deslizarArriba`, `barrido`, `zoom`, `desenfoque`, `empuje`, `cubo`, `giro`, `iris`, `reloj`, `corte`. Duración global en `duracionTransicion`.

### Audio

- **Música**: `musica.fuente` (por defecto la pista de demostración), `volumen`, `fundidoEntrada`, `fundidoSalida`, `inicioSegundos`. Se repite si es más corta que el anuncio. **Para clientes, usar solo música con licencia comercial.**
- **Efectos de sonido** por escena (`sonido`): `auto` (sugerido según el tipo), `ninguno`, uno incluido (`whoosh`, `swoosh-suave`, `pop`, `click`, `impacto`, `brillo`, `riser`) o una ruta propia en `public/`. Volumen global: `volumenEfectos`.
- Los efectos y la música de demostración se generan con `pnpm sonidos` (`scripts/generar-sonidos.py`, requiere numpy y scipy): son sintetizados, sin licencias de terceros.

### Efectos cinematográficos

`efectos`: `grano` (película), `vineta`, `destellos` (fugas de luz), `particulas`, `bandasCine`. Además `marcaDeAgua` (logo pequeño durante el anuncio) y `mostrarZonasSeguras` (guía para el Studio).

## Nuevo cliente o nuevo rubro (sin programar)

1. Copiar `datos/ejemplo-ferreteria.json` a `datos/<cliente>.json`.
2. Cambiar `tema`, textos y escenas. Copiar el material a `public/clientes/<cliente>/` y referenciarlo, p. ej. `"fondo": { "fuente": "clientes/<cliente>/local.mp4" }`.
3. `pnpm video:lote datos/<cliente>.json` → valida los datos (errores en español con la ruta del campo) y genera el MP4.

Para verlo y retocarlo en vivo: abrir `PublicidadVertical` en el Studio y pegar el contenido de `props` en el panel de props.
Para dejarlo fijo en el Studio: añadir la marca en `src/clientes/marcas.ts` y un ejemplo en `src/publicidad/ejemplos.ts`.

> El material de clientes puede pesar mucho: conviene no subirlo a git (añadir `public/clientes/` a `.gitignore` si hace falta).

## Plantilla inmobiliaria

Ver `src/ejemplo.ts` (`PropiedadVertical`): título, precio, ubicación, características, tomas (clips del DJI Flip o fotos), llamada a la acción y marca. Los clips horizontales se recortan al centro.

## Zonas seguras

Las apps tapan arriba 250 px, abajo 420 px y la columna derecha 160 px (`src/constantes.ts`). Todas las escenas colocan textos y logos dentro del área segura.

## Estructura

```
src/
  Root.tsx                 registro de composiciones
  constantes.ts            tamaño, fps, zonas seguras
  comun/                   piezas reutilizables por todas las plantillas
    esquemas.ts            esquemas Zod puros (animaciones, fondo, efectos, transiciones)
    tema.ts                esquema de identidad de marca
    contexto.tsx           tema activo + curvas de animación según el ritmo
    fuentes.ts             fuentes OFL empaquetadas
    TextoAnimado.tsx       7 animaciones de texto + palabras destacadas
    Fondo.tsx              vídeo/foto con movimiento de cámara o fondo de motion graphics
    efectos.tsx            grano, viñeta, destellos, partículas, bandas de cine
    transiciones.ts        catálogo de transiciones (+ transicionesPropias.tsx)
    Logo.tsx, AreaSegura.tsx, recursos.ts, color.ts
  publicidad/              plantilla de publicidad multirrubro
    schema.ts              props del anuncio
    PublicidadVertical.tsx composición, música, efectos de sonido, marca de agua
    escenas/               portada, medio, texto, galería, beneficios, cifra, oferta, cierre
    ejemplos.ts            plantilla genérica + ejemplos por rubro
  clientes/marcas.ts       identidades de clientes (reutilizables)
  composiciones/, escenas/, componentes/, schema.ts, ejemplo.ts   plantilla inmobiliaria y base
datos/                     anuncios en JSON para el render por lotes
scripts/
  render-lote.ts           valida y renderiza datos/*.json
  generar-sonidos.py       sintetiza efectos de sonido y música de demostración
public/
  sonidos/, musica/        audio incluido (libre de licencias)
```

## Licencias

- **Remotion**: gratuito para personas y empresas de hasta 3 empleados; por encima, o para un SaaS que renderiza para terceros, puede requerir licencia de pago. Ver ADR 0003.
- **Fuentes**: Montserrat, Inter, Bebas Neue y Playfair Display (SIL Open Font License, uso comercial permitido).
- **Audio incluido**: sintetizado en este repositorio; sin restricciones de terceros.
- **Música real de clientes**: responsabilidad de quien produce; debe tener licencia comercial para redes sociales.
