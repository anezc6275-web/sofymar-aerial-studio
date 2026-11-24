import { Easing, interpolate, useCurrentFrame } from "remotion";
import { AreaSegura } from "../../comun/AreaSegura";
import { alfa } from "../../comun/color";
import { useTema } from "../../comun/contexto";
import { FondoEscena } from "../../comun/Fondo";
import { TextoAnimado } from "../../comun/TextoAnimado";
import type { EscenaDe } from "../schema";

const RADIO = 330;

/** Cifra destacada con contador animado y anillo que se dibuja. */
export const Cifra: React.FC<{ escena: EscenaDe<"cifra">; duracion: number; indice: number }> = ({ escena, duracion, indice }) => {
  const frame = useCurrentFrame();
  const { tema, fuenteTitulos, pesoTitulos, entrada } = useTema();
  const progreso = interpolate(frame, [8, Math.max(20, duracion * 0.6)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const numero = (escena.valor * progreso).toLocaleString("es-BO", {
    minimumFractionDigits: escena.decimales,
    maximumFractionDigits: escena.decimales,
  });
  const circ = 2 * Math.PI * RADIO;
  const aparicion = entrada(frame, 0);
  const texto = `${escena.prefijo}${numero}${escena.sufijo}`;

  return (
    <>
      <FondoEscena fondo={escena.fondo} duracion={duracion} semilla={indice + 40} />
      <AreaSegura posicion="centro" alineacion="center" gap={40}>
        <div style={{ position: "relative", width: RADIO * 2 + 40, height: RADIO * 2 + 40, transform: `scale(${0.8 + aparicion * 0.2})` }}>
          <svg width={RADIO * 2 + 40} height={RADIO * 2 + 40} style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
            <circle cx={RADIO + 20} cy={RADIO + 20} r={RADIO} fill="none" stroke={alfa(tema.colorTexto, 0.12)} strokeWidth={16} />
            <circle
              cx={RADIO + 20}
              cy={RADIO + 20}
              r={RADIO}
              fill="none"
              stroke={tema.colorPrimario}
              strokeWidth={16}
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progreso)}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: fuenteTitulos,
              fontWeight: pesoTitulos,
              fontSize: Math.min(190, 900 / Math.max(3, texto.length)),
              color: tema.colorTexto,
              fontVariantNumeric: "tabular-nums",
              textShadow: `0 0 60px ${alfa(tema.colorPrimario, 0.6)}`,
            }}
          >
            {texto}
          </div>
        </div>
        {escena.texto ? (
          <TextoAnimado texto={escena.texto} tipo="texto" animacion="palabras" tamano={54} retraso={14} alineacion="center" peso={600} />
        ) : null}
      </AreaSegura>
    </>
  );
};
