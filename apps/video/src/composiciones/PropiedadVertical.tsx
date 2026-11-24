import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, Audio, type CalculateMetadataFunction } from "remotion";
import { segundos } from "../constantes";
import { Medio, resolver } from "../componentes/Medio";
import { ZonasSeguras } from "../componentes/ZonasSeguras";
import { Cierre } from "../escenas/Cierre";
import { EscenaToma } from "../escenas/EscenaToma";
import { Intro } from "../escenas/Intro";
import {
  DURACION_CIERRE_S,
  DURACION_INTRO_S,
  propiedadVerticalSchema,
  TRANSICION_S,
  type PropiedadVerticalProps,
} from "../schema";

const transicion = linearTiming({ durationInFrames: segundos(TRANSICION_S) });

/** Duración total = intro + tomas + cierre − solapes de transición. */
export const calcularMetadatos: CalculateMetadataFunction<PropiedadVerticalProps> = ({ props }) => {
  const p = propiedadVerticalSchema.parse(props);
  const escenas = [DURACION_INTRO_S, ...p.tomas.map((t) => t.duracionSegundos), DURACION_CIERRE_S];
  const total = escenas.reduce((a, s) => a + segundos(s), 0) - (escenas.length - 1) * segundos(TRANSICION_S);
  return { durationInFrames: total };
};

export const PropiedadVertical: React.FC<PropiedadVerticalProps> = (entrada) => {
  const p = propiedadVerticalSchema.parse(entrada);
  const primera = p.tomas[0]!;

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={segundos(DURACION_INTRO_S)}>
          <Medio toma={primera} indice={0} />
          <Intro titulo={p.titulo} subtitulo={p.subtitulo} ubicacion={p.ubicacion} marca={p.marca} />
        </TransitionSeries.Sequence>

        {p.tomas.flatMap((toma, i) => [
          <TransitionSeries.Transition key={`t${i}`} presentation={i % 2 ? slide({ direction: "from-right" }) : fade()} timing={transicion} />,
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={segundos(toma.duracionSegundos)}>
            <EscenaToma toma={toma} indice={i} marca={p.marca} />
          </TransitionSeries.Sequence>,
        ])}

        <TransitionSeries.Transition presentation={fade()} timing={transicion} />
        <TransitionSeries.Sequence durationInFrames={segundos(DURACION_CIERRE_S)}>
          <Cierre
            precio={p.precio}
            caracteristicas={p.caracteristicas}
            llamadaAccion={p.llamadaAccion}
            contacto={p.contacto}
            marca={p.marca}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {p.musica ? <Audio src={resolver(p.musica)} volume={0.6} /> : null}
      {p.mostrarZonasSeguras ? <ZonasSeguras /> : null}
    </AbsoluteFill>
  );
};
