import { AbsoluteFill } from "remotion";
import { ZONA_SEGURA } from "../constantes";

export type Posicion = "arriba" | "centro" | "abajo";

/** Contenedor que mantiene el contenido fuera de las zonas que tapan Reels/TikTok/Shorts. */
export const AreaSegura: React.FC<{
  posicion?: Posicion;
  alineacion?: "left" | "center" | "right";
  gap?: number;
  children: React.ReactNode;
}> = ({ posicion = "centro", alineacion = "left", gap = 28, children }) => (
  <AbsoluteFill
    style={{
      padding: `${ZONA_SEGURA.arriba}px ${ZONA_SEGURA.derecha}px ${ZONA_SEGURA.abajo}px ${ZONA_SEGURA.izquierda}px`,
      justifyContent: posicion === "arriba" ? "flex-start" : posicion === "abajo" ? "flex-end" : "center",
      alignItems: alineacion === "center" ? "center" : alineacion === "right" ? "flex-end" : "flex-start",
      textAlign: alineacion,
      gap,
    }}
  >
    {children}
  </AbsoluteFill>
);
