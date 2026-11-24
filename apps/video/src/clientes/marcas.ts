import type { TemaEntrada } from "../comun/tema";

/**
 * Identidad visual de cada cliente. Se define una vez y se reutiliza en todos sus anuncios.
 * Para un cliente nuevo: copiar una entrada, cambiar colores/fuentes y poner su logo en public/logos/.
 * (Las marcas de ejemplo son ficticias.)
 */
export const MARCAS = {
  sofymar: {
    nombreMarca: "Sofymar Aerial Studio",
    colorPrimario: "#0EA5E9",
    colorSecundario: "#6366F1",
    colorFondo: "#0B0F19",
    colorTexto: "#FFFFFF",
    fuenteTitulos: "montserrat",
    fuenteTexto: "inter",
    ritmo: "suave",
    estiloDestacado: "color",
  },
  cafeteria: {
    nombreMarca: "Aroma Café",
    colorPrimario: "#E0A458",
    colorSecundario: "#8C4A2F",
    colorFondo: "#1C120D",
    colorTexto: "#FFF8EE",
    fuenteTitulos: "playfair",
    fuenteTexto: "montserrat",
    ritmo: "suave",
    estiloDestacado: "subrayado",
  },
  gimnasio: {
    nombreMarca: "Pulso Fit",
    colorPrimario: "#B6FF3B",
    colorSecundario: "#FF3B6B",
    colorFondo: "#0A0A0A",
    colorTexto: "#FFFFFF",
    fuenteTitulos: "bebas",
    fuenteTexto: "montserrat",
    ritmo: "dinamico",
    estiloDestacado: "marcador",
    mayusculasTitulos: true,
  },
  clinica: {
    nombreMarca: "Clínica Sonrisa",
    colorPrimario: "#0FA3A3",
    colorSecundario: "#7DD3FC",
    colorFondo: "#F2FBFB",
    colorTexto: "#0B2E3A",
    fuenteTitulos: "montserrat",
    fuenteTexto: "inter",
    ritmo: "suave",
    estiloDestacado: "marcador",
  },
} satisfies Record<string, TemaEntrada>;
