import { springTiming, type TransitionPresentation } from "@remotion/transitions";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { cube } from "@remotion/transitions/cube";
import { fade } from "@remotion/transitions/fade";
import { flip } from "@remotion/transitions/flip";
import { iris } from "@remotion/transitions/iris";
import { pushCut } from "@remotion/transitions/push-cut";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { ALTO, ANCHO } from "../constantes";
import type { Transicion } from "./esquemas";
import { desenfoque, zoom } from "./transicionesPropias";


// Todas son CSS (sin WebGL), así renderizan en cualquier equipo.
export const presentacion = (nombre: Exclude<Transicion, "corte">, color: string): TransitionPresentation<any> => {
  switch (nombre) {
    case "deslizar":
      return slide({ direction: "from-right" });
    case "deslizarArriba":
      return slide({ direction: "from-bottom" });
    case "barrido":
      return wipe({ direction: "from-left" });
    case "zoom":
      return zoom();
    case "desenfoque":
      return desenfoque();
    case "empuje":
      return pushCut({ flashColor: color, flashOpacity: 0.35 });
    case "cubo":
      return cube({ direction: "from-right" });
    case "giro":
      return flip({ direction: "from-right" });
    case "iris":
      return iris({ width: ANCHO, height: ALTO });
    case "reloj":
      return clockWipe({ width: ANCHO, height: ALTO });
    default:
      return fade();
  }
};

/** Curva suave sin rebote para todas las transiciones. */
export const tiempoTransicion = (frames: number) =>
  springTiming({ config: { damping: 200 }, durationInFrames: frames, durationRestThreshold: 0.001 });
