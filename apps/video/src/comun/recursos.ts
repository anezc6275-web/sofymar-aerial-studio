import { staticFile } from "remotion";

/** Ruta en public/ o URL absoluta → URL utilizable por Remotion. */
export const resolverRecurso = (fuente: string) => (/^(https?:|data:)/.test(fuente) ? fuente : staticFile(fuente));

export const esVideo = (fuente: string) => /\.(mp4|mov|webm|m4v|mkv)(\?.*)?$/i.test(fuente);

/** Efectos de sonido incluidos (sintetizados por scripts/generar-sonidos.py, libres de licencias). */
export const SONIDOS = {
  whoosh: "sonidos/whoosh.wav",
  "swoosh-suave": "sonidos/swoosh-suave.wav",
  pop: "sonidos/pop.wav",
  click: "sonidos/click.wav",
  impacto: "sonidos/impacto.wav",
  brillo: "sonidos/brillo.wav",
  riser: "sonidos/riser.wav",
} as const;
export type NombreSonido = keyof typeof SONIDOS;

/** "whoosh" → archivo incluido; "sonidos/mio.mp3" o URL → tal cual; "ninguno" o "" → null. */
export const resolverSonido = (sonido: string): string | null => {
  if (!sonido || sonido === "ninguno") return null;
  const preset = SONIDOS[sonido as NombreSonido];
  return resolverRecurso(preset ?? sonido);
};
