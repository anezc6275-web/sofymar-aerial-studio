// Fuentes modernas con licencia OFL (libres para uso comercial), empaquetadas desde @fontsource.
// Se cargan del propio bundle: el render no depende de internet.
import { loadFont } from "@remotion/fonts";
import bebas400 from "@fontsource/bebas-neue/files/bebas-neue-latin-400-normal.woff2";
import inter400 from "@fontsource/inter/files/inter-latin-400-normal.woff2";
import inter600 from "@fontsource/inter/files/inter-latin-600-normal.woff2";
import inter800 from "@fontsource/inter/files/inter-latin-800-normal.woff2";
import mont400 from "@fontsource/montserrat/files/montserrat-latin-400-normal.woff2";
import mont600 from "@fontsource/montserrat/files/montserrat-latin-600-normal.woff2";
import mont800 from "@fontsource/montserrat/files/montserrat-latin-800-normal.woff2";
import mont900 from "@fontsource/montserrat/files/montserrat-latin-900-normal.woff2";
import play400 from "@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff2";
import play400i from "@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff2";
import play700 from "@fontsource/playfair-display/files/playfair-display-latin-700-normal.woff2";
import play800 from "@fontsource/playfair-display/files/playfair-display-latin-800-normal.woff2";
import type { NombreFuente } from "./tema";

const cargar = (family: string, url: string, weight: string, style = "normal") =>
  loadFont({ family, url, weight, style, format: "woff2" });

cargar("Bebas Neue", bebas400, "400");
cargar("Inter", inter400, "400");
cargar("Inter", inter600, "600");
cargar("Inter", inter800, "800");
cargar("Montserrat", mont400, "400");
cargar("Montserrat", mont600, "600");
cargar("Montserrat", mont800, "800");
cargar("Montserrat", mont900, "900");
cargar("Playfair Display", play400, "400");
cargar("Playfair Display", play400i, "400", "italic");
cargar("Playfair Display", play700, "700");
cargar("Playfair Display", play800, "800");

export const FAMILIAS: Record<NombreFuente, string> = {
  montserrat: '"Montserrat", "Segoe UI", Arial, sans-serif',
  inter: '"Inter", "Segoe UI", Arial, sans-serif',
  bebas: '"Bebas Neue", "Oswald", Impact, sans-serif',
  playfair: '"Playfair Display", Georgia, serif',
};

/** Peso de "negrita" adecuado a cada familia (Bebas solo tiene 400). */
export const PESO_TITULO: Record<NombreFuente, number> = { montserrat: 800, inter: 800, bebas: 400, playfair: 700 };
