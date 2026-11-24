import { z } from "zod";

// Esquemas puros (solo Zod): se usan en el Studio, en el render por lotes desde Node
// y servirán para validar las propuestas estructuradas que genere Claude.

export const animacionTextoSchema = z.enum([
  "palabras", // cada palabra sube y se enfoca
  "letras", // letra a letra
  "deslizar", // revelado con máscara, muy editorial
  "maquina", // máquina de escribir con cursor
  "escala", // cada palabra aparece con un "pop"
  "desenfoque", // cinematográfico: desenfoque + interletrado que se cierra
  "aparecer", // fundido simple
]);
export type AnimacionTexto = z.infer<typeof animacionTextoSchema>;

export const movimientoSchema = z.enum(["acercar", "alejar", "paneoIzquierda", "paneoDerecha", "subir", "bajar", "ninguno"]);

export const fondoSchema = z.object({
  // Vídeo (.mp4/.mov/.webm) o imagen en public/ o URL. Vacío = fondo animado de motion graphics con los colores de la marca.
  fuente: z.string().default(""),
  movimiento: movimientoSchema.default("acercar"),
  // Segundo del vídeo desde el que empieza.
  inicioSegundos: z.number().min(0).default(0),
  // 0 = sin capa oscura; 1 = negro. Mejora la lectura del texto sobre material claro.
  oscurecer: z.number().min(0).max(1).default(0.35),
  // Volumen del audio original del vídeo (0 = silenciado).
  volumen: z.number().min(0).max(1).default(0),
});
export type FondoEntrada = z.input<typeof fondoSchema>;
export type Fondo = z.output<typeof fondoSchema>;

export const efectosSchema = z.object({
  grano: z.boolean().default(true), // grano de película
  vineta: z.boolean().default(true), // bordes oscurecidos
  destellos: z.boolean().default(false), // fugas de luz cálidas
  particulas: z.boolean().default(true), // partículas flotantes
  bandasCine: z.boolean().default(false), // franjas negras arriba/abajo al inicio
});
export type Efectos = z.output<typeof efectosSchema>;

// Transición con la que entra una escena. Todas son CSS (sin WebGL), así renderizan en cualquier equipo.
export const transicionSchema = z.enum([
  "fundido",
  "deslizar",
  "deslizarArriba",
  "barrido",
  "zoom",
  "desenfoque",
  "empuje",
  "cubo",
  "giro",
  "iris",
  "reloj",
  "corte", // sin transición
]);
export type Transicion = z.infer<typeof transicionSchema>;
