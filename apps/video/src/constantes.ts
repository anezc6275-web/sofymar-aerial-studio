// Formato vertical 9:16 (Reels, TikTok, Shorts, Stories).
export const ANCHO = 1080;
export const ALTO = 1920;
export const FPS = 30;

// Zonas que las apps tapan con su interfaz (aprox. en 1080×1920).
// Mantener textos y logos dentro del área segura.
export const ZONA_SEGURA = {
  arriba: 250, // nombre de usuario, barra de progreso
  abajo: 420, // descripción, música, botones
  izquierda: 60,
  derecha: 160, // columna de "me gusta", comentarios, compartir
} as const;

export const segundos = (s: number) => Math.round(s * FPS);
