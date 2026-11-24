import { AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { alfa } from "./color";
import { useTema } from "./contexto";
import type { Efectos } from "./esquemas";


const Grano: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const semilla = Math.floor(frame / 2);
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay" }}>
      <filter id={`grano-${semilla}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={semilla} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grano-${semilla})`} />
    </svg>
  );
};

const Vineta: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
);

const Destellos: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / 30;
  const x = width * (0.5 + 0.6 * Math.sin(t * 0.35));
  const y = height * (0.3 + 0.25 * Math.cos(t * 0.27));
  const o = 0.25 + 0.15 * Math.sin(t * 1.3);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: o,
        background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,170,80,0.9) 0%, rgba(255,90,40,0.35) 25%, rgba(0,0,0,0) 55%)`,
      }}
    />
  );
};

const Particulas: React.FC<{ cantidad?: number }> = ({ cantidad = 36 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const { tema } = useTema();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: cantidad }).map((_, i) => {
        const r = (k: string) => random(`particula-${i}-${k}`);
        const velocidad = 0.6 + r("v") * 1.6;
        const y = (((r("y") * height - frame * velocidad) % height) + height) % height;
        const x = r("x") * width + Math.sin(frame / 40 + i) * 20;
        const tam = 3 + r("t") * 6;
        const brillo = 0.25 + 0.5 * Math.abs(Math.sin(frame / 25 + i));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: tam,
              height: tam,
              borderRadius: "50%",
              background: i % 3 === 0 ? tema.colorPrimario : tema.colorTexto,
              opacity: brillo * 0.6,
              boxShadow: `0 0 ${tam * 3}px ${alfa(tema.colorPrimario, 0.6)}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const BandasCine: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // Entran al inicio y se retiran antes del cierre.
  const alto = interpolate(frame, [0, 20, durationInFrames - 30, durationInFrames - 10], [0, 140, 140, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: alto, background: "black" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: alto, background: "black" }} />
    </AbsoluteFill>
  );
};

/** Capas cinematográficas sobre todo el anuncio. */
export const CapaEfectos: React.FC<{ efectos: Efectos }> = ({ efectos }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {efectos.particulas ? <Particulas /> : null}
    {efectos.destellos ? <Destellos /> : null}
    {efectos.vineta ? <Vineta /> : null}
    {efectos.grano ? <Grano /> : null}
    {efectos.bandasCine ? <BandasCine /> : null}
  </AbsoluteFill>
);
