/** Convierte #rgb / #rrggbb a rgba() con la opacidad indicada. */
export const alfa = (hex: string, a: number) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

/** true si el color es claro (para elegir texto oscuro/claro encima). */
export const esClaro = (hex: string) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 160;
};

export const textoSobre = (hex: string) => (esClaro(hex) ? "#0B0F19" : "#FFFFFF");
