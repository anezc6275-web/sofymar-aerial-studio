import { z } from "zod";

/** Una toma planificada dentro de un plan de producción. */
export const PlannedShotSchema = z.object({
  id: z.string(),
  orden: z.number(),
  nombre: z.string(),
  movimiento: z.string(),
  objetivo: z.string(),
  altura_m: z.string(),
  duracion_s: z.number(),
  gimbal: z.string(),
  velocidad: z.string(),
  notas: z.string(),
});
export type PlannedShot = z.infer<typeof PlannedShotSchema>;

export type ShotStatus = "pendiente" | "hecha" | "repetir";

/**
 * Plan de demostración para la Etapa 0. En la Etapa 1 lo generará Claude
 * a partir del brief de cada producción.
 */
export const DEMO_PLAN: PlannedShot[] = [
  {
    id: "t1",
    orden: 1,
    nombre: "Revelado de fachada",
    movimiento: "Reveal ascendente",
    objetivo: "Presentar la casa completa desde la calle",
    altura_m: "3 → 25",
    duracion_s: 12,
    gimbal: "0° → -25°",
    velocidad: "Lenta y constante",
    notas: "Empezar detrás del árbol o muro para revelar la fachada.",
  },
  {
    id: "t2",
    orden: 2,
    nombre: "Órbita del inmueble",
    movimiento: "Órbita 180°",
    objetivo: "Mostrar volumen y jardín",
    altura_m: "20",
    duracion_s: 15,
    gimbal: "-30°",
    velocidad: "Lenta",
    notas: "Mantener la casa centrada; evitar cables y árboles altos.",
  },
  {
    id: "t3",
    orden: 3,
    nombre: "Cenital del terreno",
    movimiento: "Top-down ascendente",
    objetivo: "Mostrar límites del terreno y piscina",
    altura_m: "30 → 60",
    duracion_s: 10,
    gimbal: "-90°",
    velocidad: "Muy lenta",
    notas: "Alinear el borde del terreno con el encuadre.",
  },
  {
    id: "t4",
    orden: 4,
    nombre: "Contexto del barrio",
    movimiento: "Dronie (alejamiento ascendente)",
    objetivo: "Ubicar la casa en su entorno y accesos",
    altura_m: "15 → 80",
    duracion_s: 15,
    gimbal: "-20°",
    velocidad: "Media",
    notas: "Terminar con la casa en el tercio inferior del encuadre.",
  },
  {
    id: "t5",
    orden: 5,
    nombre: "Acercamiento a la entrada",
    movimiento: "Push-in frontal",
    objetivo: "Invitar a entrar; cierre del vídeo",
    altura_m: "4",
    duracion_s: 8,
    gimbal: "-5°",
    velocidad: "Lenta",
    notas: "Volar en línea recta hacia la puerta principal; detenerse a distancia segura.",
  },
];
