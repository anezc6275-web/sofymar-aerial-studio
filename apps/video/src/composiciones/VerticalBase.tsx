import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { ZONA_SEGURA } from "../constantes";
import { FUENTE } from "../componentes/tipografia";
import { ZonasSeguras } from "../componentes/ZonasSeguras";

export const verticalBaseSchema = z.object({
  texto: z.string(),
  colorFondo: z.string(),
  mostrarZonasSeguras: z.boolean(),
});

/** Lienzo 9:16 mínimo: punto de partida para crear un vídeo nuevo desde cero. */
export const VerticalBase: React.FC<z.infer<typeof verticalBaseSchema>> = ({ texto, colorFondo, mostrarZonasSeguras }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const entrada = spring({ frame, fps, config: { damping: 200 } });
  const salida = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], { extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: colorFondo }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: `${ZONA_SEGURA.arriba}px ${ZONA_SEGURA.derecha}px ${ZONA_SEGURA.abajo}px ${ZONA_SEGURA.izquierda}px`,
          fontFamily: FUENTE,
          fontSize: 110,
          fontWeight: 800,
          color: "white",
          opacity: salida,
          transform: `scale(${interpolate(entrada, [0, 1], [0.8, 1])})`,
        }}
      >
        {texto}
      </AbsoluteFill>
      {mostrarZonasSeguras ? <ZonasSeguras /> : null}
    </AbsoluteFill>
  );
};
