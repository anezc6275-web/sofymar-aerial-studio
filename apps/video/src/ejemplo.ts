import type { PropiedadVerticalProps } from "./schema";

// Datos de muestra: sin material propio se renderiza con fondos degradados.
// Para usar clips del DJI Flip: copiarlos a apps/video/public/clips/ y poner p. ej. fuente: "clips/fachada.mp4".
export const ejemploPropiedad: PropiedadVerticalProps = {
  titulo: "Casa moderna con piscina",
  subtitulo: "4 dormitorios · 320 m²",
  precio: "USD 285.000",
  ubicacion: "Equipetrol · Santa Cruz",
  caracteristicas: ["Piscina y jardín", "Garaje para 3 autos", "Condominio con seguridad"],
  tomas: [
    { fuente: "", tipo: "video", rotulo: "Vista aérea", duracionSegundos: 3, inicioSegundos: 0 },
    { fuente: "", tipo: "video", rotulo: "Fachada", duracionSegundos: 3, inicioSegundos: 0 },
    { fuente: "", tipo: "imagen", rotulo: "Sala principal", duracionSegundos: 3, inicioSegundos: 0 },
    { fuente: "", tipo: "imagen", rotulo: "Piscina", duracionSegundos: 3, inicioSegundos: 0 },
  ],
  llamadaAccion: "Agenda tu visita",
  contacto: "WhatsApp +591 700 00000",
  musica: "",
  marca: { nombre: "Sofymar Aerial Studio", colorPrimario: "#0EA5E9", colorTexto: "#FFFFFF", logo: "" },
  mostrarZonasSeguras: false,
};
