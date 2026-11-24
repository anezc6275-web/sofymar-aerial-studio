import { interpolate, useCurrentFrame } from "remotion";
import { AreaSegura } from "../../comun/AreaSegura";
import { alfa, textoSobre } from "../../comun/color";
import { useTema } from "../../comun/contexto";
import { FondoEscena } from "../../comun/Fondo";
import { Logo } from "../../comun/Logo";
import { TextoAnimado } from "../../comun/TextoAnimado";
import type { EscenaDe } from "../schema";

/** Cierre con revelado del logo, eslogan, llamada a la acción y contacto. */
export const Cierre: React.FC<{ escena: EscenaDe<"cierre">; duracion: number; indice: number }> = ({ escena, duracion, indice }) => {
  const frame = useCurrentFrame();
  const { tema, fuenteTexto, entrada, suave } = useTema();
  const logo = suave(frame, 4, 30);
  const onda = interpolate(frame, [4, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boton = entrada(frame, 30);
  const pulso = frame > 50 ? 1 + 0.035 * Math.sin((frame - 50) / 5) : 1;

  return (
    <>
      <FondoEscena fondo={escena.fondo} duracion={duracion} semilla={indice + 60} />
      <AreaSegura posicion="centro" alineacion="center" gap={34}>
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 260 }}>
          <div
            style={{
              position: "absolute",
              width: 520,
              height: 520,
              borderRadius: "50%",
              border: `4px solid ${alfa(tema.colorPrimario, 1 - onda)}`,
              transform: `scale(${0.4 + onda * 0.9})`,
            }}
          />
          <div
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alfa(tema.colorPrimario, 0.35 * logo)} 0%, transparent 70%)`,
            }}
          />
          <div style={{ opacity: logo, filter: `blur(${(1 - logo) * 16}px)`, transform: `scale(${0.7 + logo * 0.3})` }}>
            <Logo alto={220} />
          </div>
        </div>
        {escena.eslogan ? (
          <TextoAnimado texto={escena.eslogan} animacion="desenfoque" tamano={60} retraso={16} alineacion="center" />
        ) : null}
        <div
          style={{
            marginTop: 10,
            padding: "26px 56px",
            borderRadius: 999,
            background: tema.colorPrimario,
            color: textoSobre(tema.colorPrimario),
            fontFamily: fuenteTexto,
            fontWeight: 800,
            fontSize: 50,
            boxShadow: `0 18px 50px ${alfa(tema.colorPrimario, 0.5)}`,
            transform: `scale(${boton * pulso})`,
          }}
        >
          {escena.llamadaAccion}
        </div>
        {escena.contacto ? (
          <TextoAnimado texto={escena.contacto} tipo="texto" animacion="aparecer" tamano={44} retraso={40} alineacion="center" peso={600} />
        ) : null}
        {escena.redes.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            {escena.redes.map((r, i) => {
              const a = entrada(frame, 46 + i * 4);
              return (
                <div
                  key={r}
                  style={{
                    padding: "10px 24px",
                    borderRadius: 999,
                    border: `2px solid ${alfa(tema.colorTexto, 0.35)}`,
                    color: tema.colorTexto,
                    fontFamily: fuenteTexto,
                    fontSize: 34,
                    fontWeight: 600,
                    opacity: a,
                    transform: `translateY(${(1 - a) * 20}px)`,
                  }}
                >
                  {r}
                </div>
              );
            })}
          </div>
        ) : null}
      </AreaSegura>
    </>
  );
};
