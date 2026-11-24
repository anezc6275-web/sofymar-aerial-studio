import { createContext, useContext } from "react";
import { spring, useVideoConfig } from "remotion";
import { FAMILIAS, PESO_TITULO } from "./fuentes";
import type { Tema } from "./tema";

const TemaContext = createContext<Tema | null>(null);
export const ProveedorTema = TemaContext.Provider;

/** Tema activo + utilidades de animación coherentes con el ritmo de la marca. */
export const useTema = () => {
  const tema = useContext(TemaContext);
  if (!tema) throw new Error("useTema debe usarse dentro de <ProveedorTema>");
  const { fps } = useVideoConfig();
  const config =
    tema.ritmo === "dinamico" ? { damping: 13, stiffness: 170, mass: 0.6 } : { damping: 200, stiffness: 90, mass: 0.9 };
  return {
    tema,
    fuenteTitulos: FAMILIAS[tema.fuenteTitulos],
    fuenteTexto: FAMILIAS[tema.fuenteTexto],
    pesoTitulos: PESO_TITULO[tema.fuenteTitulos],
    /** Valor 0→1 (con rebote si el ritmo es dinámico) que empieza en el fotograma `desde`. */
    entrada: (frame: number, desde = 0) => spring({ frame: frame - desde, fps, config }),
    /** Igual que entrada, sin rebote: para máscaras y líneas. */
    suave: (frame: number, desde = 0, duracion?: number) =>
      spring({ frame: frame - desde, fps, config: { damping: 200 }, durationInFrames: duracion }),
    escalonado: tema.ritmo === "dinamico" ? 3 : 4,
  };
};
