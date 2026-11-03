"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  DEMO_PLAN,
  type AiMode,
  type AnalyzeFrameResponse,
  type FrameAnalysis,
  type LocalMetrics,
  type ShotStatus,
} from "@sofymar/shared";
import { captureFrame } from "@/lib/metrics";
import { crearReconocedor, hablar, interpretarComando, type Reconocedor } from "@/lib/voice";

interface Registro {
  id: number;
  hora: string;
  toma: string;
  miniatura: string;
  metricas: LocalMetrics;
  analisis?: FrameAnalysis;
  modo?: AiMode;
  latenciaMs?: number;
  costeUsd?: number;
  error?: string;
}

interface Nota {
  hora: string;
  toma: string;
  texto: string;
}

interface Config {
  modo: AiMode;
  modelo: string | null;
  llamadasRestantesHoy: number | null;
}

const INTERVALOS = [0, 3, 5, 10, 20];
const CLAVE_ESTADO = "sofymar.estacion.v1";

function horaActual(): string {
  return new Date().toLocaleTimeString("es-BO", { hour12: false });
}

export default function EstacionPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const [indice, setIndice] = useState(0);
  const [estados, setEstados] = useState<Record<string, ShotStatus>>({});
  const [notas, setNotas] = useState<Nota[]>([]);

  const [intervalo, setIntervalo] = useState(5);
  const [auto, setAuto] = useState(false);
  const [vozActiva, setVozActiva] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [costeSesion, setCosteSesion] = useState(0);

  const [escuchando, setEscuchando] = useState(false);
  const [ultimaFrase, setUltimaFrase] = useState("");
  const reconocedorRef = useRef<Reconocedor | null>(null);
  const ultimaInstruccion = useRef<{ texto: string; t: number }>({ texto: "", t: 0 });
  const ocupadoRef = useRef(false);

  const toma = DEMO_PLAN[indice]!;

  // ---- Estado persistente (solo comodidad local; puede fallar sin problema) ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLAVE_ESTADO);
      if (raw) {
        const s = JSON.parse(raw) as { indice?: number; estados?: Record<string, ShotStatus>; notas?: Nota[] };
        if (typeof s.indice === "number" && s.indice < DEMO_PLAN.length) setIndice(s.indice);
        if (s.estados) setEstados(s.estados);
        if (s.notas) setNotas(s.notas);
      }
    } catch {
      /* almacenamiento no disponible */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_ESTADO, JSON.stringify({ indice, estados, notas }));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [indice, estados, notas]);

  // ---- Configuración de la API ----
  useEffect(() => {
    fetch("/api/config")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((c: Config) => setConfig(c))
      .catch(() => setErrorApi("No se pudo conectar con la API local (¿está iniciada en el puerto 4000?)."));
  }, []);

  const decir = useCallback(
    (texto: string, forzar = false) => {
      if (!vozActiva) return;
      const ahora = Date.now();
      const u = ultimaInstruccion.current;
      // Evita repetir la misma instrucción en menos de 15 s.
      if (!forzar && u.texto === texto && ahora - u.t < 15_000) return;
      ultimaInstruccion.current = { texto, t: ahora };
      hablar(texto);
    },
    [vozActiva],
  );

  // ---- Captura de pantalla (ventana del receptor AirPlay) ----
  async function iniciarCaptura() {
    try {
      const s = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 15 }, audio: false });
      s.getVideoTracks()[0]?.addEventListener("ended", () => {
        setStream(null);
        setAuto(false);
      });
      setStream(s);
    } catch {
      /* el usuario canceló */
    }
  }
  function detenerCaptura() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setAuto(false);
  }
  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, [stream]);

  // ---- Análisis de un fotograma ----
  const analizar = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !stream || ocupadoRef.current) return;
    const frame = captureFrame(video);
    if (!frame) return;
    ocupadoRef.current = true;
    setOcupado(true);
    const id = Date.now();
    const base: Registro = { id, hora: horaActual(), toma: toma.nombre, miniatura: frame.dataUrl, metricas: frame.metricas };
    try {
      const res = await fetch("/api/frames/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imagenBase64: frame.base64,
          mediaType: "image/jpeg",
          toma: {
            nombre: toma.nombre,
            movimiento: toma.movimiento,
            objetivo: toma.objetivo,
            altura_m: toma.altura_m,
            gimbal: toma.gimbal,
            notas: toma.notas,
          },
          metricas: frame.metricas,
        }),
      });
      const json = (await res.json()) as AnalyzeFrameResponse & { error?: string };
      if (!res.ok) throw new Error(json.error ?? `Error ${res.status}`);
      const coste = json.uso?.costeUsdEstimado ?? 0;
      setCosteSesion((c) => c + coste);
      if (json.llamadasRestantesHoy !== undefined) {
        setConfig((c) => (c ? { ...c, llamadasRestantesHoy: json.llamadasRestantesHoy ?? null } : c));
      }
      setRegistros((r) => [{ ...base, analisis: json.analisis, modo: json.modo, latenciaMs: json.latenciaMs, costeUsd: coste }, ...r].slice(0, 30));
      const a = json.analisis;
      if (a.alerta_seguridad) decir(`Atención: ${a.alerta_seguridad}`, true);
      else decir(a.instruccion_piloto);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error desconocido";
      setRegistros((r) => [{ ...base, error: msg }, ...r].slice(0, 30));
      if (msg.includes("Límite diario")) setAuto(false);
    } finally {
      ocupadoRef.current = false;
      setOcupado(false);
    }
  }, [stream, toma, decir]);

  // ---- Bucle automático ----
  useEffect(() => {
    if (!auto || !stream || intervalo === 0) return;
    const t = setInterval(() => void analizar(), intervalo * 1000);
    return () => clearInterval(t);
  }, [auto, stream, intervalo, analizar]);

  // ---- Plan de tomas ----
  const marcar = useCallback(
    (estado: ShotStatus, avanzar: boolean) => {
      setEstados((e) => ({ ...e, [toma.id]: estado }));
      if (avanzar && indice < DEMO_PLAN.length - 1) {
        const sig = DEMO_PLAN[indice + 1]!;
        setIndice(indice + 1);
        decir(`Toma ${sig.orden}: ${sig.nombre}. ${sig.movimiento}, altura ${sig.altura_m} metros.`, true);
      } else if (avanzar) {
        decir("Plan completo. Todas las tomas registradas.", true);
      }
    },
    [toma.id, indice, decir],
  );

  const irA = useCallback(
    (i: number) => {
      if (i < 0 || i >= DEMO_PLAN.length) return;
      setIndice(i);
      const s = DEMO_PLAN[i]!;
      decir(`Toma ${s.orden}: ${s.nombre}. ${s.movimiento}, altura ${s.altura_m} metros.`, true);
    },
    [decir],
  );

  // ---- Voz del piloto (push-to-talk) ----
  const ejecutarFrase = useCallback(
    (frase: string) => {
      setUltimaFrase(frase);
      const c = interpretarComando(frase);
      switch (c.tipo) {
        case "siguiente":
          irA(indice + 1);
          break;
        case "anterior":
          irA(indice - 1);
          break;
        case "hecha":
          marcar("hecha", true);
          break;
        case "repetir":
          marcar("repetir", false);
          decir("Marcada para repetir. Vuelve al punto de inicio.", true);
          break;
        case "analizar":
          void analizar();
          break;
        case "pausa":
          setAuto(false);
          decir("Análisis automático en pausa.", true);
          break;
        case "continuar":
          setAuto(true);
          decir("Análisis automático activado.", true);
          break;
        case "cual":
          decir(`Toma ${toma.orden}: ${toma.nombre}. ${toma.movimiento}. ${toma.notas}`, true);
          break;
        case "nota":
          setNotas((n) => [{ hora: horaActual(), toma: toma.nombre, texto: c.texto }, ...n]);
          decir("Nota guardada.", true);
          break;
      }
    },
    [indice, irA, marcar, analizar, decir, toma],
  );

  const empezarEscucha = useCallback(() => {
    if (escuchando) return;
    const r = crearReconocedor();
    if (!r) {
      setUltimaFrase("Este navegador no admite reconocimiento de voz. Usa Google Chrome o Microsoft Edge.");
      return;
    }
    r.onresult = (e) => {
      const frase = e.results[0]?.[0]?.transcript ?? "";
      if (frase) ejecutarFrase(frase);
    };
    r.onerror = (e) => setUltimaFrase(`Error de micrófono: ${e.error}`);
    r.onend = () => setEscuchando(false);
    reconocedorRef.current = r;
    setEscuchando(true);
    r.start();
  }, [escuchando, ejecutarFrase]);

  const terminarEscucha = useCallback(() => {
    reconocedorRef.current?.stop();
  }, []);

  // Barra espaciadora = push-to-talk.
  useEffect(() => {
    const abajo = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      empezarEscucha();
    };
    const arriba = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      e.preventDefault();
      terminarEscucha();
    };
    window.addEventListener("keydown", abajo);
    window.addEventListener("keyup", arriba);
    return () => {
      window.removeEventListener("keydown", abajo);
      window.removeEventListener("keyup", arriba);
    };
  }, [empezarEscucha, terminarEscucha]);

  function reiniciarPlan() {
    setEstados({});
    setIndice(0);
    setNotas([]);
  }

  const ultimo = registros[0];

  return (
    <main className="estacion">
      <header className="barra">
        <div>
          <Link href="/" className="muted small">
            ← Inicio
          </Link>
          <h1>Estación de Dirección</h1>
        </div>
        <div className="estado">
          {config ? (
            <span className={`badge ${config.modo === "claude" ? "badge-claude" : "badge-sim"}`}>
              {config.modo === "claude"
                ? `CLAUDE · ${config.modelo} · ${config.llamadasRestantesHoy ?? "?"} restantes hoy`
                : "MODO SIMULADO (gratis)"}
            </span>
          ) : null}
          {costeSesion > 0 ? <span className="badge">Sesión: ~{costeSesion.toFixed(3)} USD</span> : null}
        </div>
      </header>

      {errorApi ? <p className="aviso">{errorApi}</p> : null}

      <section className="grid">
        <div className="col">
          <div className="panel video-panel">
            {stream ? (
              <video ref={videoRef} autoPlay muted playsInline className="video" />
            ) : (
              <div className="video vacio">
                <p>
                  1. Duplica la pantalla del iPhone (DJI Fly) a esta computadora con el receptor AirPlay.
                  <br />
                  2. Pulsa <strong>Capturar ventana</strong> y elige la ventana del receptor.
                </p>
              </div>
            )}
            <div className="controles">
              {stream ? (
                <button onClick={detenerCaptura}>Detener captura</button>
              ) : (
                <button className="primario" onClick={iniciarCaptura}>
                  Capturar ventana
                </button>
              )}
              <button onClick={() => void analizar()} disabled={!stream || ocupado}>
                {ocupado ? "Analizando…" : "Analizar ahora"}
              </button>
              <label>
                Cada{" "}
                <select value={intervalo} onChange={(e) => setIntervalo(Number(e.target.value))}>
                  {INTERVALOS.map((s) => (
                    <option key={s} value={s}>
                      {s === 0 ? "manual" : `${s} s`}
                    </option>
                  ))}
                </select>
              </label>
              <label className="check">
                <input type="checkbox" checked={auto} disabled={!stream || intervalo === 0} onChange={(e) => setAuto(e.target.checked)} />
                Automático
              </label>
              <label className="check">
                <input type="checkbox" checked={vozActiva} onChange={(e) => setVozActiva(e.target.checked)} />
                Voz
              </label>
            </div>
          </div>

          <div className="panel">
            <h2>Última indicación</h2>
            {ultimo?.analisis ? (
              <div className="analisis">
                <p className="instruccion">{ultimo.analisis.instruccion_piloto}</p>
                {ultimo.analisis.alerta_seguridad ? <p className="alerta">⚠ {ultimo.analisis.alerta_seguridad}</p> : null}
                <div className="chips">
                  <span className="chip">Puntuación {ultimo.analisis.puntuacion}/10</span>
                  <span className={`chip v-${ultimo.analisis.encuadre}`}>Encuadre: {ultimo.analisis.encuadre}</span>
                  <span className={`chip v-${ultimo.analisis.exposicion}`}>Exposición: {ultimo.analisis.exposicion}</span>
                  <span className={`chip v-${ultimo.analisis.horizonte}`}>Horizonte: {ultimo.analisis.horizonte}</span>
                  <span className="chip">{ultimo.analisis.cumple_plan ? "Cumple el plan" : "No cumple el plan"}</span>
                </div>
                {ultimo.analisis.problemas.length ? (
                  <ul className="problemas">
                    {ultimo.analisis.problemas.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : ultimo?.error ? (
              <p className="aviso">{ultimo.error}</p>
            ) : (
              <p className="muted">Aún no hay análisis.</p>
            )}
          </div>

          <div className="panel">
            <h2>Voz del piloto</h2>
            <button
              className={`ptt ${escuchando ? "activo" : ""}`}
              onPointerDown={empezarEscucha}
              onPointerUp={terminarEscucha}
              onPointerLeave={terminarEscucha}
            >
              {escuchando ? "Escuchando…" : "Mantén pulsado para hablar (o barra espaciadora)"}
            </button>
            {ultimaFrase ? <p className="small">Oído: “{ultimaFrase}”</p> : null}
            <p className="muted small">
              Comandos: “hecha”, “repetir”, “siguiente”, “anterior”, “analiza”, “pausa”, “continuar”, “qué toma”.
              Cualquier otra frase se guarda como nota.
            </p>
          </div>
        </div>

        <div className="col">
          <div className="panel">
            <div className="fila">
              <h2>Plan de tomas (demo)</h2>
              <button className="small" onClick={reiniciarPlan}>
                Reiniciar
              </button>
            </div>
            <ol className="plan">
              {DEMO_PLAN.map((s, i) => {
                const est = estados[s.id] ?? "pendiente";
                return (
                  <li key={s.id} className={`toma ${i === indice ? "actual" : ""} e-${est}`} onClick={() => irA(i)}>
                    <div className="fila">
                      <strong>
                        {s.orden}. {s.nombre}
                      </strong>
                      <span className={`chip e-${est}`}>{est}</span>
                    </div>
                    {i === indice ? (
                      <div className="detalle small">
                        <div>
                          {s.movimiento} · altura {s.altura_m} m · gimbal {s.gimbal} · {s.duracion_s} s · {s.velocidad}
                        </div>
                        <div className="muted">{s.objetivo}</div>
                        <div>{s.notas}</div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>
            <div className="controles">
              <button className="primario" onClick={() => marcar("hecha", true)}>
                ✓ Hecha
              </button>
              <button onClick={() => marcar("repetir", false)}>↺ Repetir</button>
              <button onClick={() => irA(indice + 1)}>Siguiente →</button>
            </div>
          </div>

          <div className="panel">
            <h2>Notas de campo</h2>
            {notas.length ? (
              <ul className="notas small">
                {notas.map((n, i) => (
                  <li key={i}>
                    <span className="muted">
                      {n.hora} · {n.toma}:
                    </span>{" "}
                    {n.texto}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted small">Sin notas.</p>
            )}
          </div>

          <div className="panel">
            <h2>Historial</h2>
            <ul className="historial">
              {registros.map((r) => (
                <li key={r.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.miniatura} alt="" />
                  <div className="small">
                    <div>
                      {r.hora} · {r.toma}
                    </div>
                    <div className="muted">
                      brillo {r.metricas.brilloMedio.toFixed(0)} · quemado {r.metricas.porcentajeQuemado.toFixed(1)}% · nitidez{" "}
                      {r.metricas.nitidez.toFixed(0)}
                      {r.latenciaMs !== undefined ? ` · ${(r.latenciaMs / 1000).toFixed(1)} s` : ""}
                      {r.costeUsd ? ` · ~${r.costeUsd.toFixed(4)} USD` : ""}
                    </div>
                    <div>{r.error ? <span className="aviso-texto">{r.error}</span> : r.analisis?.instruccion_piloto}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
