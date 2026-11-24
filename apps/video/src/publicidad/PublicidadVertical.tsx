import { TransitionSeries } from "@remotion/transitions";
import { Fragment } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  type CalculateMetadataFunction,
} from "remotion";
import { ZonasSeguras } from "../componentes/ZonasSeguras";
import { ProveedorTema } from "../comun/contexto";
import { CapaEfectos } from "../comun/efectos";
import "../comun/fuentes";
import { Logo } from "../comun/Logo";
import { resolverRecurso, resolverSonido } from "../comun/recursos";
import { presentacion, tiempoTransicion } from "../comun/transiciones";
import { segundos, ZONA_SEGURA } from "../constantes";
import { Beneficios } from "./escenas/Beneficios";
import { Cierre } from "./escenas/Cierre";
import { Cifra } from "./escenas/Cifra";
import { EscenaMedio } from "./escenas/EscenaMedio";
import { EscenaTexto } from "./escenas/EscenaTexto";
import { Galeria } from "./escenas/Galeria";
import { Oferta } from "./escenas/Oferta";
import { Portada } from "./escenas/Portada";
import { publicidadSchema, SONIDO_AUTO, type Escena, type Publicidad, type PublicidadEntrada } from "./schema";

/** Fotogramas de cada escena, solape de su transición de entrada y fotograma de inicio. */
export const linea = (p: Publicidad) => {
  const trans = segundos(p.duracionTransicion);
  let cursor = 0;
  return p.escenas.map((escena, i) => {
    const duracion = segundos(escena.duracionSegundos);
    const solape = i > 0 && escena.transicion !== "corte" ? trans : 0;
    const inicio = cursor - solape;
    cursor = inicio + duracion;
    return { escena, duracion, solape, inicio, fin: cursor };
  });
};

export const calcularMetadatosPublicidad: CalculateMetadataFunction<PublicidadEntrada> = ({ props }) => {
  const p = publicidadSchema.parse(props);
  const tramos = linea(p);
  return { durationInFrames: tramos[tramos.length - 1]!.fin };
};

const ContenidoEscena: React.FC<{ escena: Escena; duracion: number; indice: number; volumenEfectos: number }> = (props) => {
  const { escena } = props;
  switch (escena.tipo) {
    case "portada":
      return <Portada {...props} escena={escena} />;
    case "medio":
      return <EscenaMedio {...props} escena={escena} />;
    case "texto":
      return <EscenaTexto {...props} escena={escena} />;
    case "galeria":
      return <Galeria {...props} escena={escena} />;
    case "beneficios":
      return <Beneficios {...props} escena={escena} />;
    case "cifra":
      return <Cifra {...props} escena={escena} />;
    case "oferta":
      return <Oferta {...props} escena={escena} />;
    case "cierre":
      return <Cierre {...props} escena={escena} />;
  }
};

const Musica: React.FC<{ musica: Publicidad["musica"] }> = ({ musica }) => {
  const { durationInFrames, fps } = useVideoConfig();
  if (!musica.fuente) return null;
  const entrada = Math.max(1, musica.fundidoEntrada * fps);
  const salida = Math.max(1, musica.fundidoSalida * fps);
  return (
    <Audio
      src={resolverRecurso(musica.fuente)}
      loop
      trimBefore={Math.round(musica.inicioSegundos * fps)}
      volume={(f) =>
        musica.volumen *
        interpolate(f, [0, entrada, durationInFrames - salida, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};

/** Logo pequeño durante el anuncio, con fundido de entrada y salida. */
const MarcaDeAgua: React.FC<{ duracion: number }> = ({ duracion }) => {
  const frame = useCurrentFrame();
  const opacidad = interpolate(frame, [0, 15, duracion - 15, duracion], [0, 0.9, 0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", top: ZONA_SEGURA.arriba - 80, left: ZONA_SEGURA.izquierda, opacity: opacidad }}>
        <Logo alto={64} anchoMax={520} />
      </div>
    </AbsoluteFill>
  );
};

/**
 * Plantilla de publicidad vertical 9:16 para cualquier rubro.
 * Todo se define por datos (props validadas con Zod): marca, escenas, música, efectos.
 */
export const PublicidadVertical: React.FC<PublicidadEntrada> = (entrada) => {
  const p = publicidadSchema.parse(entrada);
  const tramos = linea(p);
  const trans = segundos(p.duracionTransicion);
  const primerCierre = tramos.find((t) => t.escena.tipo === "cierre");
  const inicioMarca = tramos[1]?.inicio ?? 0;
  const finMarca = primerCierre ? primerCierre.inicio + trans : tramos[tramos.length - 1]!.fin;

  return (
    <ProveedorTema value={p.tema}>
      <AbsoluteFill style={{ backgroundColor: p.tema.colorFondo }}>
        <TransitionSeries>
          {tramos.map(({ escena, duracion }, i) => {
            const sonido = resolverSonido(escena.sonido === "auto" ? SONIDO_AUTO[escena.tipo] : escena.sonido);
            return (
              <Fragment key={i}>
                {i > 0 && escena.transicion !== "corte" ? (
                  <TransitionSeries.Transition
                    presentation={presentacion(escena.transicion, p.tema.colorPrimario)}
                    timing={tiempoTransicion(trans)}
                  />
                ) : null}
                <TransitionSeries.Sequence durationInFrames={duracion} name={`${i + 1}. ${escena.tipo}`}>
                  <ContenidoEscena escena={escena} duracion={duracion} indice={i} volumenEfectos={p.volumenEfectos} />
                  {sonido ? <Audio src={sonido} volume={p.volumenEfectos} /> : null}
                </TransitionSeries.Sequence>
              </Fragment>
            );
          })}
        </TransitionSeries>

        {p.marcaDeAgua && finMarca > inicioMarca ? (
          <Sequence from={inicioMarca} durationInFrames={finMarca - inicioMarca} name="Marca de agua">
            <MarcaDeAgua duracion={finMarca - inicioMarca} />
          </Sequence>
        ) : null}

        <CapaEfectos efectos={p.efectos} />
        <Musica musica={p.musica} />
        {p.mostrarZonasSeguras ? <ZonasSeguras /> : null}
      </AbsoluteFill>
    </ProveedorTema>
  );
};
