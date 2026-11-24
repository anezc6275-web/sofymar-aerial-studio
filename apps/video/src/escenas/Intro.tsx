import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ZONA_SEGURA } from "../constantes";
import { FUENTE } from "../componentes/tipografia";
import type { Marca } from "../schema";

type Props = { titulo: string; subtitulo: string; ubicacion: string; marca: Marca };

export const Intro: React.FC<Props> = ({ titulo, subtitulo, ubicacion, marca }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const linea = spring({ frame: frame - 8, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        padding: `${ZONA_SEGURA.arriba}px ${ZONA_SEGURA.derecha}px ${ZONA_SEGURA.abajo}px ${ZONA_SEGURA.izquierda}px`,
        background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)",
        fontFamily: FUENTE,
        color: marca.colorTexto,
      }}
    >
      {ubicacion ? (
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", opacity: entrada }}>
          {ubicacion}
        </div>
      ) : null}
      <div
        style={{
          fontSize: 104,
          fontWeight: 800,
          lineHeight: 1.02,
          marginTop: 16,
          transform: `translateY(${interpolate(entrada, [0, 1], [80, 0])}px)`,
          opacity: entrada,
        }}
      >
        {titulo}
      </div>
      <div style={{ height: 10, width: `${linea * 60}%`, background: marca.colorPrimario, marginTop: 32, borderRadius: 5 }} />
      {subtitulo ? (
        <div style={{ fontSize: 48, fontWeight: 500, marginTop: 32, opacity: linea }}>{subtitulo}</div>
      ) : null}
    </AbsoluteFill>
  );
};
