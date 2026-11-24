import { MARCAS } from "../clientes/marcas";
import type { PublicidadEntrada } from "./schema";

/**
 * Plantilla genérica: muestra todos los tipos de escena con textos de relleno.
 * Duplicar y cambiar textos, medios y tema para cada cliente.
 * Las *palabras entre asteriscos* se destacan con el color de la marca.
 */
export const plantillaGenerica: PublicidadEntrada = {
  tema: MARCAS.sofymar,
  escenas: [
    { tipo: "portada", etiqueta: "Nuevo", titular: "Tu titular *más potente* aquí", subtitulo: "Una frase corta que despierte interés", sonido: "auto" },
    { tipo: "medio", texto: "Muestra tu producto", subtexto: "Vídeo o foto a pantalla completa", transicion: "zoom", fondo: { movimiento: "paneoDerecha" } },
    { tipo: "texto", lineas: ["Rápido.", "Simple.", "*Inolvidable.*"], transicion: "desenfoque", animacion: "escala" },
    { tipo: "galeria", titulo: "Imágenes de apoyo", imagenes: ["", "", ""], disposicion: "mosaico", transicion: "deslizar" },
    {
      tipo: "beneficios",
      titulo: "¿Por qué elegirnos?",
      items: [
        { icono: "★", texto: "Beneficio principal" },
        { icono: "✓", texto: "Segundo beneficio" },
        { icono: "⚡", texto: "Tercer beneficio" },
      ],
      transicion: "barrido",
    },
    { tipo: "cifra", valor: 1500, prefijo: "+", texto: "clientes satisfechos", transicion: "iris" },
    { tipo: "oferta", etiqueta: "-20%", titulo: "Oferta por tiempo limitado", precioAnterior: "Bs 500", precio: "Bs 400", nota: "Válido hasta fin de mes", transicion: "empuje" },
    { tipo: "cierre", eslogan: "Tu eslogan aquí", llamadaAccion: "Escríbenos hoy", contacto: "WhatsApp +591 700 00000", redes: ["@tumarca", "tumarca.com"], transicion: "fundido" },
  ],
  efectos: { grano: true, vineta: true, particulas: true, destellos: false, bandasCine: false },
};

export const ejemploCafeteria: PublicidadEntrada = {
  tema: MARCAS.cafeteria,
  escenas: [
    { tipo: "portada", etiqueta: "Recién tostado", titular: "El café que *te despierta*", animacion: "desenfoque", posicion: "abajo" },
    { tipo: "texto", lineas: ["Granos de", "*los Yungas*", "tostados aquí"], animacion: "deslizar", transicion: "desenfoque" },
    { tipo: "galeria", titulo: "Nuestro menú", imagenes: ["", "", "", ""], disposicion: "cuadricula", transicion: "zoom" },
    { tipo: "oferta", etiqueta: "2x1", titulo: "Capuchinos de 8 a 10 a. m.", nota: "De lunes a viernes", transicion: "deslizarArriba" },
    { tipo: "cierre", eslogan: "Cada taza, un momento", llamadaAccion: "Visítanos", contacto: "Av. Monseñor Rivero, Santa Cruz", redes: ["@aromacafe"], transicion: "desenfoque" },
  ],
  musica: { volumen: 0.4 },
  efectos: { grano: true, vineta: true, destellos: true, particulas: false, bandasCine: true },
};

export const ejemploGimnasio: PublicidadEntrada = {
  tema: MARCAS.gimnasio,
  duracionTransicion: 0.4,
  escenas: [
    { tipo: "portada", titular: "Sin *excusas*", subtitulo: "Empieza hoy tu cambio", animacion: "escala", alineacion: "center" },
    { tipo: "texto", lineas: ["Entrena", "*más fuerte*", "cada día"], animacion: "letras", transicion: "empuje", tamano: 170 },
    {
      tipo: "beneficios",
      titulo: "Todo incluido",
      items: [
        { icono: "🏋", texto: "Zona de pesas" },
        { icono: "🔥", texto: "Clases funcionales" },
        { icono: "🥗", texto: "Plan nutricional" },
        { icono: "⏰", texto: "Abierto 5:00 a 23:00" },
      ],
      transicion: "cubo",
    },
    { tipo: "cifra", valor: 98, sufijo: "%", texto: "de socios logra su meta", transicion: "zoom" },
    { tipo: "oferta", etiqueta: "-50%", titulo: "Inscripción", precioAnterior: "Bs 200", precio: "Bs 100", nota: "Solo este mes", transicion: "giro" },
    { tipo: "cierre", llamadaAccion: "Únete ahora", contacto: "WhatsApp +591 700 00000", redes: ["@pulsofit"], transicion: "empuje" },
  ],
  efectos: { grano: true, vineta: true, particulas: true, destellos: false, bandasCine: false },
};

export const ejemploClinica: PublicidadEntrada = {
  tema: MARCAS.clinica,
  escenas: [
    { tipo: "portada", etiqueta: "Odontología", titular: "Tu *mejor sonrisa* empieza aquí", animacion: "palabras" },
    { tipo: "medio", texto: "Tecnología de última generación", subtexto: "Diagnóstico digital en una sola visita", transicion: "deslizar" },
    {
      tipo: "beneficios",
      titulo: "Tratamientos",
      items: [
        { icono: "✦", texto: "Blanqueamiento" },
        { icono: "✦", texto: "Ortodoncia invisible" },
        { icono: "✦", texto: "Implantes" },
      ],
      transicion: "barrido",
    },
    { tipo: "cifra", valor: 12, sufijo: " años", texto: "cuidando sonrisas", transicion: "reloj" },
    { tipo: "cierre", eslogan: "Atención con calidez", llamadaAccion: "Agenda tu cita", contacto: "+591 3 300 0000", transicion: "fundido" },
  ],
  musica: { volumen: 0.35 },
  efectos: { grano: false, vineta: false, particulas: false, destellos: false, bandasCine: false },
};
