import { Audio, Sequence, useCurrentFrame } from "remotion";
import { AreaSegura } from "../../comun/AreaSegura";
import { alfa, textoSobre } from "../../comun/color";
import { useTema } from "../../comun/contexto";
import { FondoEscena } from "../../comun/Fondo";
import { resolverSonido } from "../../comun/recursos";
import { TextoAnimado } from "../../comun/TextoAnimado";
import type { EscenaDe } from "../schema";

const PRIMER_ITEM = 14;
const PASO = 10;

export const Beneficios: React.FC<{ escena: EscenaDe<"beneficios">; duracion: number; indice: number; volumenEfectos: number }> = ({
  escena,
  duracion,
  indice,
  volumenEfectos,
}) => {
  const frame = useCurrentFrame();
  const { tema, fuenteTexto, entrada } = useTema();
  const sonido = resolverSonido(escena.sonidoPorItem);

  return (
    <>
      <FondoEscena fondo={escena.fondo} duracion={duracion} semilla={indice + 30} />
      <AreaSegura posicion="centro" gap={30}>
        {escena.titulo ? <TextoAnimado texto={escena.titulo} animacion="deslizar" tamano={86} /> : null}
        {escena.items.map((item, i) => {
          const a = entrada(frame, PRIMER_ITEM + i * PASO);
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                width: "100%",
                padding: "20px 26px",
                borderRadius: 26,
                background: alfa(tema.colorTexto, 0.08),
                border: `2px solid ${alfa(tema.colorTexto, 0.12)}`,
                opacity: Math.min(1, a * 1.4),
                transform: `translateX(${(1 - a) * -120}px)`,
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: 92,
                  height: 92,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: tema.colorPrimario,
                  color: textoSobre(tema.colorPrimario),
                  fontSize: 46,
                  fontFamily: fuenteTexto,
                  fontWeight: 800,
                  transform: `scale(${a}) rotate(${(1 - a) * -90}deg)`,
                }}
              >
                {item.icono}
              </div>
              <div style={{ fontFamily: fuenteTexto, fontSize: 46, fontWeight: 600, color: tema.colorTexto, lineHeight: 1.2 }}>
                {item.texto}
              </div>
            </div>
          );
        })}
      </AreaSegura>
      {sonido
        ? escena.items.map((_, i) => (
            <Sequence key={i} from={PRIMER_ITEM + i * PASO} durationInFrames={20} layout="none">
              <Audio src={sonido} volume={volumenEfectos * 0.7} />
            </Sequence>
          ))
        : null}
    </>
  );
};
