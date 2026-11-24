import { useCurrentFrame } from "remotion";
import { AreaSegura } from "../../comun/AreaSegura";
import { textoSobre } from "../../comun/color";
import { useTema } from "../../comun/contexto";
import { FondoEscena } from "../../comun/Fondo";
import { TextoAnimado } from "../../comun/TextoAnimado";
import type { EscenaDe } from "../schema";
import { tamanoAjustado } from "./util";

export const Portada: React.FC<{ escena: EscenaDe<"portada">; duracion: number; indice: number }> = ({ escena, duracion, indice }) => {
  const frame = useCurrentFrame();
  const { tema, fuenteTexto, entrada, suave } = useTema();
  const etiqueta = entrada(frame, 2);
  const linea = suave(frame, 14, 25);
  const tamano = tamanoAjustado(escena.titular, tema.fuenteTitulos === "bebas" ? 190 : 140, 84);

  return (
    <>
      <FondoEscena fondo={escena.fondo} duracion={duracion} semilla={indice} />
      <AreaSegura posicion={escena.posicion} alineacion={escena.alineacion}>
        {escena.etiqueta ? (
          <div
            style={{
              fontFamily: fuenteTexto,
              fontWeight: 800,
              fontSize: 34,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: textoSobre(tema.colorPrimario),
              background: tema.colorPrimario,
              padding: "12px 26px",
              borderRadius: 999,
              opacity: etiqueta,
              transform: `translateY(${(1 - etiqueta) * 30}px) scale(${0.8 + etiqueta * 0.2})`,
            }}
          >
            {escena.etiqueta}
          </div>
        ) : null}
        <TextoAnimado texto={escena.titular} animacion={escena.animacion} tamano={tamano} retraso={6} alineacion={escena.alineacion} />
        <div style={{ height: 10, width: `${linea * 45}%`, background: tema.colorPrimario, borderRadius: 5 }} />
        {escena.subtitulo ? (
          <TextoAnimado
            texto={escena.subtitulo}
            tipo="texto"
            animacion="aparecer"
            tamano={46}
            retraso={20}
            alineacion={escena.alineacion}
            alturaLinea={1.3}
          />
        ) : null}
      </AreaSegura>
    </>
  );
};
