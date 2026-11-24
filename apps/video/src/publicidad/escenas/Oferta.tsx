import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { AreaSegura } from "../../comun/AreaSegura";
import { alfa, textoSobre } from "../../comun/color";
import { useTema } from "../../comun/contexto";
import { FondoEscena } from "../../comun/Fondo";
import { TextoAnimado } from "../../comun/TextoAnimado";
import type { EscenaDe } from "../schema";

export const Oferta: React.FC<{ escena: EscenaDe<"oferta">; duracion: number; indice: number }> = ({ escena, duracion, indice }) => {
  const frame = useCurrentFrame();
  const { tema, fuenteTitulos, fuenteTexto, pesoTitulos, entrada, suave } = useTema();
  const sello = entrada(frame, 4);
  const tachado = suave(frame, 22, 14);
  const precio = entrada(frame, 30);
  const latido = 1 + 0.025 * Math.sin((frame - 30) / 6) * (frame > 40 ? 1 : 0);

  return (
    <>
      <FondoEscena fondo={escena.fondo} duracion={duracion} semilla={indice + 50} />
      {/* Franjas diagonales en movimiento */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, ${alfa(tema.colorPrimario, 0.08)} 0 40px, transparent 40px 80px)`,
          backgroundPosition: `${frame * 2}px 0`,
        }}
      />
      <AreaSegura posicion="centro" alineacion="center" gap={30}>
        {escena.etiqueta ? (
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: tema.colorPrimario,
              color: textoSobre(tema.colorPrimario),
              fontFamily: fuenteTitulos,
              fontWeight: pesoTitulos,
              fontSize: escena.etiqueta.length > 5 ? 64 : 96,
              boxShadow: `0 0 0 ${14 + 8 * Math.sin(frame / 8)}px ${alfa(tema.colorPrimario, 0.25)}`,
              transform: `scale(${sello}) rotate(${interpolate(sello, [0, 1], [-40, -8])}deg)`,
            }}
          >
            {escena.etiqueta}
          </div>
        ) : null}
        {escena.titulo ? <TextoAnimado texto={escena.titulo} animacion="palabras" tamano={72} retraso={10} alineacion="center" /> : null}
        {escena.precioAnterior ? (
          <div style={{ position: "relative", fontFamily: fuenteTexto, fontSize: 52, fontWeight: 500, color: alfa(tema.colorTexto, 0.7), opacity: suave(frame, 16, 10) }}>
            {escena.precioAnterior}
            <div
              style={{
                position: "absolute",
                left: -8,
                right: -8,
                top: "52%",
                height: 6,
                background: tema.colorPrimario,
                transform: `scaleX(${tachado}) rotate(-6deg)`,
                transformOrigin: "left",
              }}
            />
          </div>
        ) : null}
        {escena.precio ? (
          <div
            style={{
              fontFamily: fuenteTitulos,
              fontWeight: pesoTitulos,
              fontSize: 150,
              lineHeight: 1,
              color: tema.colorPrimario,
              opacity: Math.min(1, precio * 1.5),
              transform: `scale(${(0.4 + precio * 0.6) * latido})`,
              textShadow: `0 10px 50px ${alfa(tema.colorPrimario, 0.5)}`,
            }}
          >
            {escena.precio}
          </div>
        ) : null}
        {escena.nota ? <TextoAnimado texto={escena.nota} tipo="texto" animacion="aparecer" tamano={36} retraso={44} alineacion="center" /> : null}
      </AreaSegura>
    </>
  );
};
