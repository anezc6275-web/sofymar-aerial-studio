import type { LocalMetrics } from "@sofymar/shared";

/**
 * Métricas de imagen calculadas en el navegador (gratis, sin IA):
 * brillo medio, % de píxeles quemados/negros y una estimación de nitidez
 * (media del valor absoluto del laplaciano sobre la luminancia).
 */
export function computeMetrics(data: ImageData): LocalMetrics {
  const { width, height, data: px } = data;
  const n = width * height;
  const lum = new Float32Array(n);
  let suma = 0;
  let quemados = 0;
  let negros = 0;
  for (let i = 0; i < n; i++) {
    const r = px[i * 4]!;
    const g = px[i * 4 + 1]!;
    const b = px[i * 4 + 2]!;
    const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    lum[i] = y;
    suma += y;
    if (y >= 250) quemados++;
    if (y <= 5) negros++;
  }
  let lap = 0;
  let cuenta = 0;
  for (let yy = 1; yy < height - 1; yy++) {
    for (let xx = 1; xx < width - 1; xx++) {
      const i = yy * width + xx;
      const v = 4 * lum[i]! - lum[i - 1]! - lum[i + 1]! - lum[i - width]! - lum[i + width]!;
      lap += Math.abs(v);
      cuenta++;
    }
  }
  return {
    brilloMedio: n ? suma / n : 0,
    porcentajeQuemado: n ? (quemados / n) * 100 : 0,
    porcentajeNegro: n ? (negros / n) * 100 : 0,
    nitidez: cuenta ? lap / cuenta : 0,
  };
}

/** Captura un fotograma del vídeo: JPEG para enviar y métricas locales. */
export function captureFrame(
  video: HTMLVideoElement,
  anchoMax = 1280,
): { base64: string; dataUrl: string; metricas: LocalMetrics } | null {
  const w = video.videoWidth;
  const h = video.videoHeight;
  if (!w || !h) return null;
  const escala = Math.min(1, anchoMax / w);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * escala);
  canvas.height = Math.round(h * escala);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.75);

  // Métricas sobre una versión reducida (más rápido).
  const mini = document.createElement("canvas");
  const escalaMini = Math.min(1, 320 / canvas.width);
  mini.width = Math.round(canvas.width * escalaMini);
  mini.height = Math.round(canvas.height * escalaMini);
  const mctx = mini.getContext("2d");
  if (!mctx) return null;
  mctx.drawImage(canvas, 0, 0, mini.width, mini.height);
  const metricas = computeMetrics(mctx.getImageData(0, 0, mini.width, mini.height));

  return { base64: dataUrl.split(",")[1] ?? "", dataUrl, metricas };
}
