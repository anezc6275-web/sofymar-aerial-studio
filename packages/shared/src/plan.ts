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

/**
 * Plan para una torre de vidrio con podio curvo (edificio de gran altura).
 * Alturas estimadas: confirmar la altura real de la torre y el límite legal
 * de la DGAC antes de volar. El piloto decide siempre.
 */
export const TORRE_PLAN: PlannedShot[] = [
  {
    id: "torre-t1",
    orden: 1,
    nombre: "Revelado tras las palmeras",
    movimiento: "Reveal ascendente (pedestal)",
    objetivo: "Presentar el conjunto completo desde el césped frontal",
    altura_m: "3 → 20",
    duracion_s: 12,
    gimbal: "0°",
    velocidad: "Lenta y constante",
    notas: "Despegar desde el césped, a 40-50 m de la fachada. Subir detrás de la línea de palmeras hasta que aparezca el podio blanco. No volar sobre la calle, los autos ni los peatones.",
  },
  {
    id: "torre-t2",
    orden: 2,
    nombre: "Ascenso por la torre",
    movimiento: "Pedestal vertical",
    objetivo: "Recorrer la altura de la torre: podio, balcones en espiral y fachada de vidrio",
    altura_m: "20 → 80",
    duracion_s: 18,
    gimbal: "-5° → 0°",
    velocidad: "Muy lenta",
    notas: "Mantener al menos 30 m de distancia horizontal de la fachada. Torre centrada y vertical en el encuadre, sin inclinar el horizonte. El vidrio puede engañar a los sensores de obstáculos: no confiar en ellos cerca de la fachada.",
  },
  {
    id: "torre-t3",
    orden: 3,
    nombre: "Órbita de la silueta",
    movimiento: "Órbita 120°",
    objetivo: "Mostrar cómo cambia la forma curva de la torre según el ángulo",
    altura_m: "60",
    duracion_s: 16,
    gimbal: "-15°",
    velocidad: "Lenta",
    notas: "Radio amplio (60 m o más) para tener margen con la torre y las torres laterales. Revisar antes el recorrido completo de la órbita en busca de grúas, antenas y otros edificios.",
  },
  {
    id: "torre-t4",
    orden: 4,
    nombre: "Lateral del podio curvo",
    movimiento: "Travelling lateral (truck)",
    objetivo: "Destacar las bandas horizontales blancas y las palmeras de la base",
    altura_m: "12",
    duracion_s: 10,
    gimbal: "-10°",
    velocidad: "Lenta",
    notas: "Desplazarse en paralelo a la fachada del podio, sobre el césped. Usar las palmeras de primer plano para dar paralaje. Hacerla solo si no hay personas debajo del recorrido.",
  },
  {
    id: "torre-t5",
    orden: 5,
    nombre: "Cenital del podio",
    movimiento: "Top-down ascendente",
    objetivo: "Mostrar la planta circular del podio y la plaza",
    altura_m: "50 → 80",
    duracion_s: 10,
    gimbal: "-90°",
    velocidad: "Muy lenta",
    notas: "Posicionarse sobre el podio, desplazado de la torre (no encima de ella). Alinear la curva del podio con el borde del encuadre.",
  },
  {
    id: "torre-t6",
    orden: 6,
    nombre: "Corona contra el cielo",
    movimiento: "Paralaje lateral lento",
    objetivo: "Plano de impacto de la punta de la torre con nubes y cielo",
    altura_m: "80",
    duracion_s: 10,
    gimbal: "0°",
    velocidad: "Muy lenta",
    notas: "Encuadrar la corona desde 80 m y a buena distancia. Subir más solo si la altura real de la torre y el límite legal respecto al punto de despegue lo permiten. Viento más fuerte en altura y junto a edificios altos.",
  },
  {
    id: "torre-t7",
    orden: 7,
    nombre: "Contexto urbano",
    movimiento: "Dronie (alejamiento ascendente)",
    objetivo: "Ubicar el proyecto en su entorno: avenida, edificios vecinos y áreas verdes",
    altura_m: "40 → 100",
    duracion_s: 15,
    gimbal: "-15°",
    velocidad: "Media",
    notas: "Retroceder sobre el césped o zonas sin gente. Terminar con la torre en el tercio central y espacio de cielo arriba para el logo o texto.",
  },
  {
    id: "torre-t8",
    orden: 8,
    nombre: "Aproximación final",
    movimiento: "Push-in frontal bajo",
    objetivo: "Cierre del vídeo: invitar a entrar al proyecto",
    altura_m: "4",
    duracion_s: 8,
    gimbal: "0° → -5°",
    velocidad: "Lenta",
    notas: "Avanzar en línea recta sobre el césped hacia la entrada y detenerse antes de la calle. No sobrevolar autos ni peatones; si hay tráfico de personas, cortar la toma antes.",
  },
];

/** Planes disponibles en la Estación de Dirección hasta la Etapa 1. */
export const PLANES = [
  { id: "demo", nombre: "Casa (demo)", tomas: DEMO_PLAN },
  { id: "torre", nombre: "Torre de vidrio con podio", tomas: TORRE_PLAN },
] as const satisfies readonly { id: string; nombre: string; tomas: PlannedShot[] }[];
export type PlanId = (typeof PLANES)[number]["id"];
