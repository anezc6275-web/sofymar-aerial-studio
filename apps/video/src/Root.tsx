import { Composition, Folder } from "remotion";
import { ALTO, ANCHO, FPS } from "./constantes";
import { calcularMetadatos, PropiedadVertical } from "./composiciones/PropiedadVertical";
import { VerticalBase, verticalBaseSchema } from "./composiciones/VerticalBase";
import { ejemploPropiedad } from "./ejemplo";
import { propiedadVerticalSchema } from "./schema";

export const RemotionRoot: React.FC = () => (
  <Folder name="Vertical-9x16">
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
);
