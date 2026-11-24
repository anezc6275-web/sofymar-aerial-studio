/** Tamaño de letra que se reduce cuanto más largo es el texto. */
export const tamanoAjustado = (texto: string, max: number, min: number, factor = 1.6) =>
  Math.round(Math.max(min, Math.min(max, max + 40 - texto.replace(/\*/g, "").length * factor)));
