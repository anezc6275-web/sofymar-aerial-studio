import { useCurrentFrame } from "remotion";
import { AreaSegura } from "../../comun/AreaSegura";
import { alfa } from "../../comun/color";
import { useTema } from "../../comun/contexto";
import { FondoEscena } from "../../comun/Fondo";
import { TextoAnimado } from "../../comun/TextoAnimado";
import type { EscenaDe } from "../schema";

/** Tipografía cinética: líneas que entran una tras otra. */
export const EscenaTexto: React.FC<{ escena: EscenaDe<"texto">; duracion: number; indice: number }> = ({ escena, duracion, indice }) => {
  const frame = useCurrentFrame();
  const { tema, suave } = useTema();
  const paso = Math.min(16, Math.floor((duracion * 0.45) / escena.lineas.length));
  const anillo = suave(frame, 0, 40);

  return (
    <>
      <FondoEscena fondo={escena.fondo} duracion={duracion} semilla={indice + 10} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "46%",
          width: 900,
          height: 900,
          marginLeft: -450,
          marginTop: -450,
          borderRadius: "50%",
          border: `3px solid ${alfa(tema.colorPrimario, 0.35)}`,
          transform: `scale(${0.6 + anillo * 0.4}) rotate(${frame * 0.4}deg)`,
          opacity: anillo,
          borderTopColor: tema.colorPrimario,
        }}
      />
      <AreaSegura posicion="centro" alineacion={escena.alineacion} gap={8}>
        {escena.lineas.map((linea, i) => (
          <TextoAnimado
            key={i}
            texto={linea}
            animacion={escena.animacion}
            tamano={escena.tamano}
            retraso={4 + i * paso}
            alineacion={escena.alineacion}
            alturaLinea={1.02}
          />
        ))}
      </AreaSegura>
    </>
  );
};
