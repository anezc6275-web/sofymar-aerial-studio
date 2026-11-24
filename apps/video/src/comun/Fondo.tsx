import { AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, random, useCurrentFrame, useVideoConfig } from "remotion";
import { alfa } from "./color";
import { useTema } from "./contexto";
import type { Fondo } from "./esquemas";
import { esVideo, resolverRecurso } from "./recursos";


/** Movimiento de cámara tipo "Ken Burns" con suavizado cinematográfico. */
export const useMovimiento = (movimiento: Fondo["movimiento"], duracion: number) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, duracion], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });
  switch (movimiento) {
    case "acercar":
      return `scale(${interpolate(p, [0, 1], [1.02, 1.16])})`;
    case "alejar":
      return `scale(${interpolate(p, [0, 1], [1.18, 1.03])})`;
    case "paneoIzquierda":
      return `scale(1.18) translateX(${interpolate(p, [0, 1], [5, -5])}%)`;
    case "paneoDerecha":
      return `scale(1.18) translateX(${interpolate(p, [0, 1], [-5, 5])}%)`;
    case "subir":
      return `scale(1.18) translateY(${interpolate(p, [0, 1], [5, -5])}%)`;
    case "bajar":
      return `scale(1.18) translateY(${interpolate(p, [0, 1], [-5, 5])}%)`;
    default:
      return "none";
  }
};

/** Fondo animado sin material: manchas de color en movimiento + formas geométricas. */
export const FondoAnimado: React.FC<{ semilla?: number; intensidad?: number }> = ({ semilla = 0, intensidad = 1 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { tema } = useTema();
  const t = frame / 30;
  const manchas = [tema.colorPrimario, tema.colorSecundario, tema.colorPrimario];

  return (
    <AbsoluteFill style={{ backgroundColor: tema.colorFondo, overflow: "hidden" }}>
      {manchas.map((c, i) => {
        const r = (k: string) => random(`${semilla}-${i}-${k}`);
        const x = r("x") * width + Math.sin(t * (0.3 + r("vx") * 0.4) + i) * 220;
        const y = r("y") * height + Math.cos(t * (0.25 + r("vy") * 0.4) + i * 2) * 260;
        const d = 700 + r("d") * 500;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - d / 2,
              top: y - d / 2,
              width: d,
              height: d,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alfa(c, 0.55 * intensidad)} 0%, ${alfa(c, 0)} 70%)`,
            }}
          />
        );
      })}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.18 * intensidad }}>
        <circle
          cx={width * (0.2 + random(`${semilla}-cx`) * 0.6)}
          cy={height * (0.25 + random(`${semilla}-cy`) * 0.5)}
          r={380}
          fill="none"
          stroke={tema.colorTexto}
          strokeWidth={2}
          strokeDasharray="8 22"
          transform={`rotate(${t * 12} ${width / 2} ${height / 2})`}
        />
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1={-200 + i * 260 + ((t * 40) % 260)}
            y1={height}
            x2={300 + i * 260 + ((t * 40) % 260)}
            y2={0}
            stroke={tema.colorTexto}
            strokeWidth={1}
            opacity={0.35}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** Fondo de escena: vídeo, imagen o motion graphics, con movimiento de cámara y capa para legibilidad. */
export const FondoEscena: React.FC<{ fondo: Fondo; duracion: number; semilla?: number }> = ({ fondo, duracion, semilla = 0 }) => {
  const { fps } = useVideoConfig();
  const transform = useMovimiento(fondo.movimiento, duracion);
  const estilo: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform };

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      {!fondo.fuente ? (
        <AbsoluteFill style={{ transform }}>
          <FondoAnimado semilla={semilla} />
        </AbsoluteFill>
      ) : esVideo(fondo.fuente) ? (
        <OffthreadVideo
          src={resolverRecurso(fondo.fuente)}
          trimBefore={Math.round(fondo.inicioSegundos * fps)}
          volume={fondo.volumen}
          muted={fondo.volumen === 0}
          style={estilo}
        />
      ) : (
        <Img src={resolverRecurso(fondo.fuente)} style={estilo} />
      )}
      {fondo.fuente && fondo.oscurecer > 0 ? (
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,${fondo.oscurecer * 0.6}) 0%, rgba(0,0,0,${fondo.oscurecer * 0.3}) 40%, rgba(0,0,0,${fondo.oscurecer}) 100%)`,
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
