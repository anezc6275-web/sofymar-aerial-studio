import { z } from "zod";

// Este archivo solo define esquemas (sin React ni recursos) para poder usarlo también desde Node.

export const colorHex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Color hexadecimal, p. ej. #0EA5E9");

export const fuenteSchema = z.enum(["montserrat", "inter", "bebas", "playfair"]);
export type NombreFuente = z.infer<typeof fuenteSchema>;

/** Identidad visual de un cliente. Se reutiliza en todos sus anuncios. */
export const temaSchema = z.object({
  nombreMarca: z.string().min(1),
  // Ruta en public/ (p. ej. "logos/cliente.png", ideal PNG/SVG con fondo transparente) o URL. Vacío = logotipo de texto.
  logo: z.string().default(""),
  colorPrimario: colorHex,
  colorSecundario: colorHex,
  colorFondo: colorHex,
  colorTexto: colorHex,
  fuenteTitulos: fuenteSchema.default("montserrat"),
  fuenteTexto: fuenteSchema.default("inter"),
  // suave = elegante y fluido; dinamico = rebote y energía.
  ritmo: z.enum(["suave", "dinamico"]).default("suave"),
  // Cómo se resaltan las *palabras entre asteriscos*.
  estiloDestacado: z.enum(["color", "marcador", "subrayado"]).default("color"),
  mayusculasTitulos: z.boolean().default(false),
});

export type TemaEntrada = z.input<typeof temaSchema>;
export type Tema = z.output<typeof temaSchema>;
