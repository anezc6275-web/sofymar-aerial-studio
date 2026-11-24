import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ZONA_SEGURA } from "../constantes";
import { resolver } from "../componentes/Medio";
import { FUENTE } from "../componentes/tipografia";
import type { Marca } from "../schema";

type Props = {
  precio: string;
  caracteristicas: string[];
  llamadaAccion: string;
  contacto: string;
  marca: Marca;
};

export const Cierre: React.FC<Props> = ({ precio, caracteristicas, llamadaAccion, contacto, marca }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const paso = (retraso: number) => spring({ frame: frame - retraso, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(170deg, #0b0f19 0%, #111827 60%, ${marca.colorPrimario} 160%)`,
        color: marca.colorTexto,
        fontFamily: FUENTE,
        justifyContent: "center",
        padding: `${ZONA_SEGURA.arriba}px ${ZONA_SEGURA.derecha}px ${ZONA_SEGURA.abajo}px ${ZONA_SEGURA.izquierda}px`,
        gap: 36,
      }}
    >
      {precio ? (
        <div style={{ fontSize: 96, fontWeight: 800, opacity: paso(0), color: marca.colorPrimario }}>{precio}</div>
      ) : null}
      {caracteristicas.map((c, i) => (
        <div key={c} style={{ fontSize: 48, fontWeight: 500, opacity: paso(6 + i * 5) }}>
          • {c}
        </div>
      ))}
      <div
        style={{
          alignSelf: "flex-start",
          marginTop: 24,
          padding: "24px 44px",
          borderRadius: 999,
          background: marca.colorPrimario,
          fontSize: 50,
          fontWeight: 800,
          transform: `scale(${paso(30)})`,
        }}
      >
        {llamadaAccion}
      </div>
      {contacto ? <div style={{ fontSize: 44, opacity: paso(38) }}>{contacto}</div> : null}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 24, opacity: paso(44) }}>
        {marca.logo ? <Img src={resolver(marca.logo)} style={{ height: 110 }} /> : null}
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{marca.nombre}</div>
      </div>
    </AbsoluteFill>
  );
};
