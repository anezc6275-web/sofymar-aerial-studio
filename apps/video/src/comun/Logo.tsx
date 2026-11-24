import { Img } from "remotion";
import { useTema } from "./contexto";
import { resolverRecurso } from "./recursos";

/** Logo del cliente; si no hay archivo, logotipo tipográfico con el nombre de la marca. */
export const Logo: React.FC<{ alto: number; anchoMax?: number; color?: string; estilo?: React.CSSProperties }> = ({
  alto,
  anchoMax = 860,
  color,
  estilo,
}) => {
  const { tema, fuenteTitulos, pesoTitulos } = useTema();
  if (tema.logo) {
    return <Img src={resolverRecurso(tema.logo)} style={{ height: alto, maxWidth: anchoMax, objectFit: "contain", ...estilo }} />;
  }
  return (
    <div
      style={{
        fontFamily: fuenteTitulos,
        fontWeight: pesoTitulos,
        // El logotipo de texto se reduce para no salirse del ancho disponible.
        fontSize: Math.min(alto * 0.55, anchoMax / (tema.nombreMarca.length * 0.78)),
        lineHeight: 1,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: color ?? tema.colorTexto,
        whiteSpace: "nowrap",
        ...estilo,
      }}
    >
      {tema.nombreMarca}
    </div>
  );
};
