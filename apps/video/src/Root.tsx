import { Composition, Folder } from "remotion";
import { ALTO, ANCHO, FPS } from "./constantes";
import { calcularMetadatos, PropiedadVertical } from "./composiciones/PropiedadVertical";
import { VerticalBase, verticalBaseSchema } from "./composiciones/VerticalBase";
import { ejemploPropiedad } from "./ejemplo";
import { propiedadVerticalSchema } from "./schema";
import { ejemploCafeteria, ejemploClinica, ejemploGimnasio, plantillaGenerica } from "./publicidad/ejemplos";
import { calcularMetadatosPublicidad, PublicidadVertical } from "./publicidad/PublicidadVertical";
import { publicidadSchema, type PublicidadEntrada } from "./publicidad/schema";

const anuncio = (id: string, props: PublicidadEntrada) => (
  <Composition
    id={id}
    component={PublicidadVertical}
    width={ANCHO}
    height={ALTO}
    fps={FPS}
    durationInFrames={FPS * 20}
    schema={publicidadSchema}
    defaultProps={props}
    calculateMetadata={calcularMetadatosPublicidad}
  />
);

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Publicidad">
      {anuncio("PublicidadVertical", plantillaGenerica)}
      <Folder name="Ejemplos-por-rubro">
        {anuncio("Publicidad-Cafeteria", ejemploCafeteria)}
        {anuncio("Publicidad-Gimnasio", ejemploGimnasio)}
        {anuncio("Publicidad-Clinica", ejemploClinica)}
      </Folder>
    </Folder>
    <Folder name="Inmobiliaria">
      <Composition
        id="PropiedadVertical"
        component={PropiedadVertical}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={FPS * 15}
        schema={propiedadVerticalSchema}
        defaultProps={ejemploPropiedad}
        calculateMetadata={calcularMetadatos}
      />
    </Folder>
    <Folder name="Base">
      <Composition
        id="VerticalBase"
        component={VerticalBase}
        width={ANCHO}
        height={ALTO}
        fps={FPS}
        durationInFrames={FPS * 5}
        schema={verticalBaseSchema}
        defaultProps={{ texto: "Tu idea aquí", colorFondo: "#0B0F19", mostrarZonasSeguras: true }}
      />
    </Folder>
  </>
);
