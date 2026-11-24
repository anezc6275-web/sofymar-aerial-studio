import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ZONA_SEGURA } from "../constantes";
import { Medio } from "../componentes/Medio";
import { FUENTE } from "../componentes/tipografia";
import type { Marca, Toma } from "../schema";

export const EscenaToma: React.FC<{ toma: Toma; indice: number; marca: Marca }> = ({ toma, indice, marca }) => {
  const frame = useCurrentFrame();
  const aparicion = interpolate(frame, [10, 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Medio toma={toma} indice={indice} />
      {toma.rotulo ? (
        <div
          style={{
            position: "absolute",
            left: ZONA_SEGURA.izquierda,
            bottom: ZONA_SEGURA.abajo + 40,
            maxWidth: 1080 - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha,
            padding: "18px 30px",
            borderLeft: `10px solid ${marca.colorPrimario}`,
            background: "rgba(0,0,0,0.55)",
            color: marca.colorTexto,
            fontFamily: FUENTE,
            fontSize: 52,
            fontWeight: 700,
            opacity: aparicion,
            transform: `translateX(${interpolate(aparicion, [0, 1], [-40, 0])}px)`,
          }}
        >
          {toma.rotulo}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
