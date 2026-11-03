import { z } from "zod";

const Valoracion = z.enum(["bien", "mejorable", "mal"]);

/**
 * Resultado del análisis de un fotograma en vivo.
 * Es también el esquema de salida estructurada que se exige a Claude.
 */
export const FrameAnalysisSchema = z.strictObject({
  cumple_plan: z.boolean().describe("La imagen corresponde a la toma planificada actual"),
  puntuacion: z.number().describe("Calidad global de 0 a 10"),
  encuadre: Valoracion,
  exposicion: Valoracion,
  horizonte: Valoracion,
  problemas: z.array(z.string()).describe("Problemas detectados, frases cortas"),
  instruccion_piloto: z
    .string()
    .describe("Una sola instrucción breve y accionable para el piloto (máx. 15 palabras)"),
  alerta_seguridad: z
    .string()
    .describe("Riesgo visible (cables, árboles, personas); cadena vacía si no hay"),
});
export type FrameAnalysis = z.infer<typeof FrameAnalysisSchema>;

/** Métricas calculadas en el navegador, sin IA y sin coste. */
export const LocalMetricsSchema = z.object({
  brilloMedio: z.number(),
  porcentajeQuemado: z.number(),
  porcentajeNegro: z.number(),
  nitidez: z.number(),
});
export type LocalMetrics = z.infer<typeof LocalMetricsSchema>;

export const AnalyzeFrameRequestSchema = z.object({
  imagenBase64: z.string().min(100),
  mediaType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  toma: z.object({
    nombre: z.string(),
    movimiento: z.string(),
    objetivo: z.string(),
    altura_m: z.string(),
    gimbal: z.string(),
    notas: z.string(),
  }),
  metricas: LocalMetricsSchema,
});
export type AnalyzeFrameRequest = z.infer<typeof AnalyzeFrameRequestSchema>;

export type AiMode = "simulado" | "claude";

export interface AnalyzeFrameResponse {
  modo: AiMode;
  analisis: FrameAnalysis;
  latenciaMs: number;
  uso?: { inputTokens: number; outputTokens: number; costeUsdEstimado: number };
  llamadasRestantesHoy?: number;
}
