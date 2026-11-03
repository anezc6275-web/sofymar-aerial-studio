/** Precios en USD por millón de tokens (entrada, salida). Verificar periódicamente. */
const PRECIOS: Record<string, { entrada: number; salida: number }> = {
  "claude-opus-5-5": { entrada: 4, salida: 20 },
  "claude-sonnet-5-5": { entrada: 2, salida: 10 },
  "claude-haiku-5-5": { entrada: 0.1, salida: 0.5 },
};

export function estimarCosteUsd(modelo: string, inputTokens: number, outputTokens: number): number {
  const p = PRECIOS[modelo];
  if (!p) return 0;
  return (inputTokens * p.entrada + outputTokens * p.salida) / 1_000_000;
}
