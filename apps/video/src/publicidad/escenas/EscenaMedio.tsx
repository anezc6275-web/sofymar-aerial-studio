import { useCurrentFrame } from "remotion";
import { AreaSegura } from "../../comun/AreaSegura";
import { alfa } from "../../comun/color";
import { useTema } from "../../comun/contexto";
import { FondoEscena } from "../../comun/Fondo";
import { TextoAnimado } from "../../comun/TextoAnimado";
import type { EscenaDe } from "../schema";
import { tamanoAjustado } from "./util";

/** Vídeo o foto a pantalla completa con rótulo inferior animado. */
export const EscenaMedio: React.FC<{ escena: EscenaDe<"medio">; duracion: number; indice: number }> = ({ escena, duracion, indice }) => {
  const frame = useCurrentFrame();
  const { tema, suave } = useTema();
  const barra = suave(frame, 6, 20);
  const panel = suave(frame, 0, 25);
  const hayTexto = Boolean(escena.texto || escena.subtexto);

  return (
    <>
      <FondoEscena fondo={escena.fondo} duracion={duracion} semilla={indice} />
      {hayTexto ? (
        <AreaSegura posicion={escena.posicion} gap={0}>
          <div
            style={{
              display: "flex",
              gap: 28,
              padding: "30px 34px",
              borderRadius: 24,
              background: `linear-gradient(90deg, ${alfa(tema.colorFondo, 0.75 * panel)}, ${alfa(tema.colorFondo, 0.15 * panel)})`,
              backdropFilter: `blur(${panel * 12}px)`,
            }}
          >
            <div style={{ width: 10, borderRadius: 5, background: tema.colorPrimario, transform: `scaleY(${barra})`, transformOrigin: "top" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {escena.texto ? (
                <TextoAnimado texto={escena.texto} animacion={escena.animacion} tamano={tamanoAjustado(escena.texto, 84, 56, 1.2)} retraso={8} />
              ) : null}
              {escena.subtexto ? (
                <TextoAnimado texto={escena.subtexto} tipo="texto" animacion="aparecer" tamano={40} retraso={20} alturaLinea={1.3} />
              ) : null}
            </div>
          </div>
        </AreaSegura>
      ) : null}
    </>
  );
};
