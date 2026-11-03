import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import {
  FrameAnalysisSchema,
  type AnalyzeFrameRequest,
  type FrameAnalysis,
  type LocalMetrics,
} from "@sofymar/shared";
import { FRAME_PROMPT_VERSION, FRAME_SYSTEM_PROMPT } from "./prompts";
import { estimarCosteUsd } from "./pricing";

export interface FrameAnalysisResult {
  analisis: FrameAnalysis;
  uso?: { inputTokens: number; outputTokens: number; costeUsdEstimado: number };
  promptVersion: string;
  modelo: string;
}

export class AiRefusalError extends Error {}

/** Análisis con Claude (de pago). */
export async function analyzeFrameWithClaude(
  client: Anthropic,
  modelo: string,
  req: AnalyzeFrameRequest,
): Promise<FrameAnalysisResult> {
  const m = req.metricas;
  const contexto = [
    `Toma planificada actual: ${req.toma.nombre}`,
    `Movimiento: ${req.toma.movimiento}`,
    `Objetivo: ${req.toma.objetivo}`,
    `Altura prevista (m): ${req.toma.altura_m}`,
    `Gimbal previsto: ${req.toma.gimbal}`,
    `Notas: ${req.toma.notas}`,
    `Métricas locales: brillo medio ${m.brilloMedio.toFixed(0)}/255, quemado ${m.porcentajeQuemado.toFixed(1)}%, negro ${m.porcentajeNegro.toFixed(1)}%, nitidez ${m.nitidez.toFixed(0)}.`,
  ].join("\n");

  const response = await client.beta.messages.parse({
    model: modelo,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    // Respuesta rápida para uso en vivo.
    output_config: { effort: "low", format: betaZodOutputFormat(FrameAnalysisSchema) },
    cache_control: { type: "ephemeral" },
    system: FRAME_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: req.mediaType, data: req.imagenBase64 } },
          { type: "text", text: contexto },
        ],
      },
    ],
  });

  if (response.stop_reason === "refusal") {
    throw new AiRefusalError(response.stop_details?.explanation ?? "Claude rechazó la solicitud");
  }
  if (!response.parsed_output) {
    throw new Error(`Respuesta sin JSON válido (stop_reason=${response.stop_reason})`);
  }
  const inputTokens =
    response.usage.input_tokens +
    (response.usage.cache_read_input_tokens ?? 0) +
    (response.usage.cache_creation_input_tokens ?? 0);
  const outputTokens = response.usage.output_tokens;
  return {
    analisis: response.parsed_output,
    uso: { inputTokens, outputTokens, costeUsdEstimado: estimarCosteUsd(modelo, inputTokens, outputTokens) },
    promptVersion: FRAME_PROMPT_VERSION,
    modelo: response.model,
  };
}

/**
 * Análisis SIMULADO (gratis): usa solo las métricas locales calculadas en el
 * navegador. Sirve para probar todo el flujo de la Estación sin gastar.
 */
export function analyzeFrameSimulated(req: AnalyzeFrameRequest): FrameAnalysisResult {
  const { exposicion, problemas, instruccion } = evaluarMetricas(req.metricas);
  const nitidaOk = req.metricas.nitidez >= 8;
  if (!nitidaOk) problemas.push("Imagen poco nítida o con movimiento brusco");
  const puntuacion = Math.max(
    0,
    10 - problemas.length * 2 - (exposicion === "mal" ? 2 : 0),
  );
  return {
    analisis: {
      cumple_plan: true,
      puntuacion,
      encuadre: "mejorable",
      exposicion,
      horizonte: "mejorable",
      problemas,
      instruccion_piloto:
        instruccion ??
        (nitidaOk
          ? `Modo simulado: exposición correcta. Continúa con ${req.toma.nombre.toLowerCase()}.`
          : "Modo simulado: suaviza el movimiento, la imagen se ve borrosa."),
      alerta_seguridad: "",
    },
    promptVersion: "simulado-v1",
    modelo: "simulado",
  };
}

function evaluarMetricas(m: LocalMetrics): {
  exposicion: FrameAnalysis["exposicion"];
  problemas: string[];
  instruccion?: string;
} {
  const problemas: string[] = [];
  if (m.porcentajeQuemado > 8 || m.brilloMedio > 200) {
    problemas.push(`Sobreexposición (${m.porcentajeQuemado.toFixed(1)}% de píxeles quemados)`);
    return { exposicion: "mal", problemas, instruccion: "Baja la exposición; el cielo está quemado." };
  }
  if (m.porcentajeNegro > 15 || m.brilloMedio < 50) {
    problemas.push(`Subexposición (${m.porcentajeNegro.toFixed(1)}% de píxeles negros)`);
    return { exposicion: "mal", problemas, instruccion: "Sube la exposición; la imagen está oscura." };
  }
  if (m.porcentajeQuemado > 3) {
    problemas.push("Altas luces al límite");
    return { exposicion: "mejorable", problemas };
  }
  return { exposicion: "bien", problemas };
}
