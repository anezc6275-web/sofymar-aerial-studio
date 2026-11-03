/** Voz gratuita del navegador: síntesis (TTS) y reconocimiento (STT). */

let vozElegida: SpeechSynthesisVoice | null = null;

function elegirVoz(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  const voces = window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith("es"));
  const preferencia = ["es-bo", "es-419", "es-us", "es-mx", "es-ar", "es-es"];
  for (const p of preferencia) {
    const v = voces.find((x) => x.lang.toLowerCase() === p);
    if (v) return v;
  }
  return voces[0] ?? null;
}

export function hablar(texto: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !texto.trim()) return;
  vozElegida ??= elegirVoz();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = vozElegida?.lang ?? "es-419";
  if (vozElegida) u.voice = vozElegida;
  u.rate = 1.05;
  window.speechSynthesis.cancel(); // la instrucción más reciente manda
  window.speechSynthesis.speak(u);
}

// Tipado mínimo de la Web Speech API (no está en lib.dom de TypeScript).
interface ResultadoReconocimiento {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}
export interface Reconocedor {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: ResultadoReconocimiento) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

export function crearReconocedor(): Reconocedor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => Reconocedor;
    webkitSpeechRecognition?: new () => Reconocedor;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const r = new Ctor();
  r.lang = "es-BO";
  r.interimResults = false;
  r.continuous = false;
  return r;
}

export type Comando =
  | { tipo: "siguiente" }
  | { tipo: "anterior" }
  | { tipo: "hecha" }
  | { tipo: "repetir" }
  | { tipo: "analizar" }
  | { tipo: "pausa" }
  | { tipo: "continuar" }
  | { tipo: "cual" }
  | { tipo: "nota"; texto: string };

const quitarTildes = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Intenciones rápidas sin IA (respuesta inmediata y gratis). */
export function interpretarComando(frase: string): Comando {
  const t = quitarTildes(frase.toLowerCase()).trim();
  if (/\b(repetir|repite|otra vez)\b/.test(t)) return { tipo: "repetir" };
  // "Hecha" antes que "siguiente": "toma hecha, siguiente" marca y avanza.
  if (/\b(hecha|hecho|lista|listo|terminada|completada)\b/.test(t)) return { tipo: "hecha" };
  if (/\b(siguiente|proxima)\b/.test(t)) return { tipo: "siguiente" };
  if (/\b(anterior|atras)\b/.test(t)) return { tipo: "anterior" };
  if (/\b(analiza|analizar|revisa|revisar|como se ve|como va)\b/.test(t)) return { tipo: "analizar" };
  if (/\b(pausa|pausar|detener|deten)\b/.test(t)) return { tipo: "pausa" };
  if (/\b(continuar|continua|reanudar|seguir)\b/.test(t)) return { tipo: "continuar" };
  if (/\b(que toma|cual toma|toma actual|instrucciones)\b/.test(t)) return { tipo: "cual" };
  return { tipo: "nota", texto: frase.trim() };
}
