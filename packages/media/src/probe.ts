/**
 * Prueba técnica (Etapa 0): inspecciona archivos del DJI Flip con ffprobe
 * y extrae fotogramas de muestra con ffmpeg.
 *
 * Uso:  pnpm media:probe <archivo-o-carpeta> [--frames 6] [--out ./media-local/frames]
 * Requiere ffmpeg y ffprobe instalados y en el PATH.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, resolve } from "node:path";

const EXT_MEDIA = new Set([".mp4", ".mov", ".jpg", ".jpeg", ".dng"]);

interface FfprobeStream {
  codec_type?: string;
  codec_name?: string;
  profile?: string;
  width?: number;
  height?: number;
  r_frame_rate?: string;
  pix_fmt?: string;
  color_transfer?: string;
  color_primaries?: string;
  bit_rate?: string;
}
interface FfprobeOut {
  streams?: FfprobeStream[];
  format?: { duration?: string; size?: string; bit_rate?: string; tags?: Record<string, string> };
}

function args() {
  const a = process.argv.slice(2);
  const objetivo = a.find((x) => !x.startsWith("--"));
  const val = (k: string, d: string) => {
    const i = a.indexOf(k);
    return i >= 0 && a[i + 1] ? a[i + 1]! : d;
  };
  return { objetivo, frames: Number(val("--frames", "6")), out: val("--out", "./media-local/frames") };
}

function listar(objetivo: string): string[] {
  const p = resolve(objetivo);
  if (statSync(p).isDirectory()) {
    return readdirSync(p)
      .filter((f) => EXT_MEDIA.has(extname(f).toLowerCase()))
      .map((f) => join(p, f));
  }
  return [p];
}

function fps(r?: string): string {
  if (!r) return "?";
  const [n, d] = r.split("/").map(Number);
  return n && d ? (n / d).toFixed(2) : r;
}

function perfilColor(s: FfprobeStream): string {
  const t = s.color_transfer ?? "";
  if (t === "arib-std-b67") return "HLG";
  if (/10/.test(s.pix_fmt ?? "") && (t === "" || t === "bt709")) return "10 bits (posible D-Log M; verificar)";
  return t ? `Normal (${t})` : "Normal";
}

function inspeccionar(archivo: string, frames: number, outDir: string) {
  const raw = execFileSync("ffprobe", ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", archivo], {
    encoding: "utf8",
  });
  const info = JSON.parse(raw) as FfprobeOut;
  const v = info.streams?.find((s) => s.codec_type === "video");
  const dur = Number(info.format?.duration ?? 0);
  const mb = Number(info.format?.size ?? 0) / 1024 / 1024;
  const srt = archivo.replace(/\.(mp4|mov)$/i, ".SRT");

  console.log(`\n■ ${basename(archivo)}`);
  console.log(`  Tamaño: ${mb.toFixed(1)} MB · Duración: ${dur ? dur.toFixed(1) + " s" : "—"}`);
  if (v) {
    console.log(`  Vídeo: ${v.codec_name} ${v.profile ?? ""} · ${v.width}x${v.height} · ${fps(v.r_frame_rate)} fps · ${v.pix_fmt}`);
    console.log(`  Color: ${perfilColor(v)} · bitrate ${v.bit_rate ? (Number(v.bit_rate) / 1e6).toFixed(1) + " Mbps" : "?"}`);
  }
  console.log(`  Telemetría .SRT junto al vídeo: ${existsSync(srt) ? "sí" : "no"}`);

  if (v && dur > 0 && frames > 0) {
    const destino = join(outDir, basename(archivo, extname(archivo)));
    mkdirSync(destino, { recursive: true });
    for (let i = 0; i < frames; i++) {
      const t = ((i + 0.5) * dur) / frames;
      execFileSync("ffmpeg", [
        "-v", "error", "-y", "-ss", t.toFixed(2), "-i", archivo,
        "-frames:v", "1", "-vf", "scale='min(1568,iw)':-2", "-q:v", "3",
        join(destino, `frame_${String(i + 1).padStart(2, "0")}.jpg`),
      ]);
    }
    console.log(`  ${frames} fotogramas extraídos en ${destino}`);
  }
}

const { objetivo, frames, out } = args();
if (!objetivo) {
  console.error("Uso: pnpm media:probe <archivo-o-carpeta> [--frames 6] [--out ./media-local/frames]");
  process.exit(1);
}
for (const f of listar(objetivo)) {
  try {
    inspeccionar(f, frames, out);
  } catch (e) {
    console.error(`  Error con ${f}: ${e instanceof Error ? e.message : e}`);
  }
}
