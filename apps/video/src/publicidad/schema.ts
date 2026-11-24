import { z } from "zod";
import { animacionTextoSchema, efectosSchema, fondoSchema, transicionSchema } from "../comun/esquemas";
import { temaSchema } from "../comun/tema";

// Campos comunes a todas las escenas.
const base = (duracionPorDefecto: number) => ({
  duracionSegundos: z.number().min(1).max(30).default(duracionPorDefecto),
  // Transición con la que ENTRA esta escena (en la primera escena se ignora).
  transicion: transicionSchema.default("fundido"),
  // "auto" = sonido sugerido para el tipo de escena; "ninguno"; un efecto incluido
  // (whoosh, swoosh-suave, pop, click, impacto, brillo, riser) o una ruta en public/.
  sonido: z.string().default("auto"),
  fondo: fondoSchema.prefault({}),
});

const posicion = z.enum(["arriba", "centro", "abajo"]);
const alineacion = z.enum(["left", "center", "right"]);

export const portadaSchema = z.object({
  tipo: z.literal("portada"),
  ...base(3),
  etiqueta: z.string().default(""), // texto pequeño sobre el titular, p. ej. "NUEVO"
  titular: z.string().min(1), // admite *palabras destacadas*
  subtitulo: z.string().default(""),
  animacion: animacionTextoSchema.default("palabras"),
  posicion: posicion.default("centro"),
  alineacion: alineacion.default("left"),
});

export const medioSchema = z.object({
  tipo: z.literal("medio"),
  ...base(3),
  texto: z.string().default(""),
  subtexto: z.string().default(""),
  animacion: animacionTextoSchema.default("deslizar"),
  posicion: posicion.default("abajo"),
});

export const textoSchema = z.object({
  tipo: z.literal("texto"),
  ...base(3),
  lineas: z.array(z.string()).min(1).max(5),
  animacion: animacionTextoSchema.default("escala"),
  alineacion: alineacion.default("center"),
  tamano: z.number().min(40).max(220).default(120),
});

export const galeriaSchema = z.object({
  tipo: z.literal("galeria"),
  ...base(4),
  titulo: z.string().default(""),
  imagenes: z.array(z.string()).min(1).max(6), // rutas en public/ o URLs; "" = marcador de posición
  disposicion: z.enum(["cuadricula", "mosaico", "carrusel"]).default("mosaico"),
});

export const beneficiosSchema = z.object({
  tipo: z.literal("beneficios"),
  ...base(4),
  titulo: z.string().default(""),
  items: z
    .array(z.object({ icono: z.string().default("✓"), texto: z.string().min(1) }))
    .min(1)
    .max(5),
  sonidoPorItem: z.string().default("pop"),
});

export const cifraSchema = z.object({
  tipo: z.literal("cifra"),
  ...base(3),
  valor: z.number(),
  decimales: z.number().int().min(0).max(2).default(0),
  prefijo: z.string().default(""),
  sufijo: z.string().default(""),
  texto: z.string().default(""),
});

export const ofertaSchema = z.object({
  tipo: z.literal("oferta"),
  ...base(3.5),
  etiqueta: z.string().default(""), // p. ej. "-30%"
  titulo: z.string().default(""),
  precio: z.string().default(""),
  precioAnterior: z.string().default(""),
  nota: z.string().default(""), // p. ej. "Válido hasta el 31/12"
});

export const cierreSchema = z.object({
  tipo: z.literal("cierre"),
  ...base(4),
  eslogan: z.string().default(""),
  llamadaAccion: z.string().default("Contáctanos"),
  contacto: z.string().default(""),
  redes: z.array(z.string()).max(4).default([]),
});

export const escenaSchema = z.discriminatedUnion("tipo", [
  portadaSchema,
  medioSchema,
  textoSchema,
  galeriaSchema,
  beneficiosSchema,
  cifraSchema,
  ofertaSchema,
  cierreSchema,
]);

export const musicaSchema = z.object({
  // Ruta en public/ o URL. Vacío = sin música. Usar solo pistas con licencia comercial.
  fuente: z.string().default("musica/demo-ambiente.mp3"),
  volumen: z.number().min(0).max(1).default(0.45),
  fundidoEntrada: z.number().min(0).max(5).default(1),
  fundidoSalida: z.number().min(0).max(5).default(2),
  inicioSegundos: z.number().min(0).default(0),
});

export const publicidadSchema = z.object({
  tema: temaSchema,
  escenas: z.array(escenaSchema).min(1).max(20),
  duracionTransicion: z.number().min(0.2).max(1).default(0.6),
  musica: musicaSchema.prefault({}),
  volumenEfectos: z.number().min(0).max(1).default(0.6),
  efectos: efectosSchema.prefault({}),
  marcaDeAgua: z.boolean().default(true), // logo pequeño durante el anuncio
  mostrarZonasSeguras: z.boolean().default(false),
});

export type PublicidadEntrada = z.input<typeof publicidadSchema>;
export type Publicidad = z.output<typeof publicidadSchema>;
export type Escena = z.output<typeof escenaSchema>;
export type EscenaDe<T extends Escena["tipo"]> = Extract<Escena, { tipo: T }>;

export const SONIDO_AUTO: Record<Escena["tipo"], string> = {
  portada: "impacto",
  medio: "whoosh",
  texto: "swoosh-suave",
  galeria: "whoosh",
  beneficios: "swoosh-suave",
  cifra: "riser",
  oferta: "impacto",
  cierre: "brillo",
};
