import { AbsoluteFill } from "remotion";
import { ZONA_SEGURA } from "../constantes";

const tapado = "rgba(255, 0, 80, 0.25)";

/** Guía visual (solo para el Studio): áreas que tapa la interfaz de Reels/TikTok. */
export const ZonasSeguras: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: ZONA_SEGURA.arriba, background: tapado }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: ZONA_SEGURA.abajo, background: tapado }} />
    <div
      style={{
        position: "absolute",
        top: ZONA_SEGURA.arriba,
        bottom: ZONA_SEGURA.abajo,
        right: 0,
        width: ZONA_SEGURA.derecha,
        background: tapado,
      }}
    />
    <div
      style={{
        position: "absolute",
        top: ZONA_SEGURA.arriba,
        bottom: ZONA_SEGURA.abajo,
        left: ZONA_SEGURA.izquierda,
        right: ZONA_SEGURA.derecha,
        border: "4px dashed rgba(0, 255, 120, 0.9)",
      }}
    />
  </AbsoluteFill>
);
