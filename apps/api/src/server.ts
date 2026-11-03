import Fastify from "fastify";
import Anthropic from "@anthropic-ai/sdk";
import {
  AnalyzeFrameRequestSchema,
  type AiMode,
  type AnalyzeFrameResponse,
} from "@sofymar/shared";
import { AiRefusalError, analyzeFrameSimulated, analyzeFrameWithClaude } from "@sofymar/ai";
import { DailyBudget } from "./budget";

const PORT = Number(process.env.API_PORT ?? 4000);
const MODELO = process.env.CLAUDE_MODEL || "claude-opus-5-5";
const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
const modo: AiMode = apiKey ? "claude" : "simulado";
const client = apiKey ? new Anthropic({ apiKey, maxRetries: 1, timeout: 30_000 }) : null;
const presupuesto = new DailyBudget(Number(process.env.MAX_AI_CALLS_PER_DAY ?? 200));

// Fotogramas en base64: hasta ~6 MB por petición.
const app = Fastify({ logger: { level: "info" }, bodyLimit: 6 * 1024 * 1024 });

app.get("/api/health", async () => ({ ok: true }));

app.get("/api/config", async () => ({
  modo,
  modelo: modo === "claude" ? MODELO : null,
  llamadasRestantesHoy: modo === "claude" ? presupuesto.restantes() : null,
}));

app.post("/api/frames/analyze", async (request, reply) => {
  const parsed = AnalyzeFrameRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ error: "Solicitud inválida", detalle: parsed.error.issues });
  }
  const inicio = Date.now();

  if (!client) {
    const r = analyzeFrameSimulated(parsed.data);
    const body: AnalyzeFrameResponse = { modo, analisis: r.analisis, latenciaMs: Date.now() - inicio };
    return body;
  }

  if (!presupuesto.consumir()) {
    return reply.code(429).send({
      error: "Límite diario de llamadas a Claude alcanzado (MAX_AI_CALLS_PER_DAY).",
    });
  }

  try {
    const r = await analyzeFrameWithClaude(client, MODELO, parsed.data);
    // Registro de uso (en Etapa 1 se guardará en ai_interactions).
    request.log.info(
      { modelo: r.modelo, prompt: r.promptVersion, uso: r.uso, latenciaMs: Date.now() - inicio },
      "analisis_fotograma",
    );
    const body: AnalyzeFrameResponse = {
      modo,
      analisis: r.analisis,
      latenciaMs: Date.now() - inicio,
      uso: r.uso,
      llamadasRestantesHoy: presupuesto.restantes(),
    };
    return body;
  } catch (error) {
    if (error instanceof AiRefusalError) {
      return reply.code(422).send({ error: `Claude no analizó este fotograma: ${error.message}` });
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return reply.code(502).send({ error: "Clave de Anthropic inválida. Revisa ANTHROPIC_API_KEY." });
    }
    if (error instanceof Anthropic.RateLimitError) {
      return reply.code(429).send({ error: "Anthropic limitó la frecuencia. Aumenta el intervalo." });
    }
    if (error instanceof Anthropic.APIError) {
      request.log.error({ status: error.status, msg: error.message }, "error_anthropic");
      return reply.code(502).send({ error: `Error de la API de Anthropic (${error.status ?? "red"})` });
    }
    request.log.error(error, "error_analisis");
    return reply.code(500).send({ error: "Error interno al analizar el fotograma" });
  }
});

app.listen({ port: PORT, host: "127.0.0.1" }).then(() => {
  app.log.info(`API Sofymar en http://localhost:${PORT} · modo IA: ${modo.toUpperCase()}`);
});
