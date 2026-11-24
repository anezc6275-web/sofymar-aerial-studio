import { z } from "zod";

const colorHex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color hexadecimal, p. ej. #0EA5E9");

export const marcaSchema = z.object({
  nombre: z.string().min(1),
  colorPrimario: colorHex,
  colorTexto: colorHex,
  // Ruta en public/ (p. ej. "logo.png") o URL. Vacío = solo texto.
  logo: z.string().default(""),
});

export const tomaSchema = z.object({
  // Ruta en public/ (p. ej. "clips/fachada.mp4" o "fotos/sala.jpg") o URL.
  // Vacío = fondo degradado de muestra (útil para maquetar sin material).
  fuente: z.string().default(""),
  tipo: z.enum(["video", "imagen"]).default("video"),
  rotulo: z.string().default(""),
  duracionSegundos: z.number().min(1).max(30).default(3),
  // Segundo del clip desde el que empieza (solo vídeo).
  inicioSegundos: z.number().min(0).default(0),
});

export const propiedadVerticalSchema = z.object({
  titulo: z.string().min(1),
  subtitulo: z.string().default(""),
  precio: z.string().default(""),
  ubicacion: z.string().default(""),
  caracteristicas: z.array(z.string()).max(4).default([]),
  tomas: z.array(tomaSchema).min(1).max(20),
  llamadaAccion: z.string().default("Agenda tu visita"),
  contacto: z.string().default(""),
  musica: z.string().default(""), // ruta en public/ con licencia comercial
  marca: marcaSchema,
  mostrarZonasSeguras: z.boolean().default(false),
});

export type PropiedadVerticalProps = z.input<typeof propiedadVerticalSchema>;
export type Toma = z.output<typeof tomaSchema>;
export type Marca = z.output<typeof marcaSchema>;

export const DURACION_INTRO_S = 3;
export const DURACION_CIERRE_S = 4;
export const TRANSICION_S = 0.5;
