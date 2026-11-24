import { AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Toma } from "../schema";

const resolver = (fuente: string) => (/^https?:\/\//.test(fuente) ? fuente : staticFile(fuente));

const DEGRADADOS = [
  "linear-gradient(160deg, #0ea5e9 0%, #1e3a8a 100%)",
  "linear-gradient(160deg, #f59e0b 0%, #b45309 100%)",
  "linear-gradient(160deg, #10b981 0%, #065f46 100%)",
  "linear-gradient(160deg, #a855f7 0%, #4c1d95 100%)",
];

/** Muestra un clip o una foto a pantalla completa (recorte 9:16) con zoom lento tipo Ken Burns. */
export const Medio: React.FC<{ toma: Toma; indice: number }> = ({ toma, indice }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const escala = interpolate(frame, [0, durationInFrames], [1, toma.tipo === "imagen" ? 1.12 : 1.05]);
  const estilo: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: `scale(${escala})`,
  };

  if (!toma.fuente) {
    return (
      <AbsoluteFill style={{ background: DEGRADADOS[indice % DEGRADADOS.length], transform: `scale(${escala})` }} />
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {toma.tipo === "video" ? (
        <OffthreadVideo
          src={resolver(toma.fuente)}
          muted
          trimBefore={Math.round(toma.inicioSegundos * fps)}
          style={estilo}
        />
      ) : (
        <Img src={resolver(toma.fuente)} style={estilo} />
      )}
    </AbsoluteFill>
  );
};

export { resolver };
