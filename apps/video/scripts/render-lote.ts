/**
 * Renderiza en lote los anuncios definidos en archivos JSON (uno por pieza).
 *
 *   pnpm render:lote                 # todos los .json de datos/
 *   pnpm render:lote datos/x.json    # solo los indicados
 *
 * Formato de cada JSON:
 *   { "composicion": "PublicidadVertical", "salida": "out/cliente.mp4", "props": { ...según el esquema... } }
 *
 * Variable opcional REMOTION_NAVEGADOR: ruta a un Chrome/Chromium ya instalado.
 */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { publicidadSchema } from "../src/publicidad/schema";
import { propiedadVerticalSchema } from "../src/schema";

z.config(z.locales.es()); // mensajes de validación en español

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const ESQUEMAS: Record<string, z.ZodType> = {
  PublicidadVertical: publicidadSchema,
  PropiedadVertical: propiedadVerticalSchema,
};

const trabajoSchema = z.object({
  composicion: z.string().default("PublicidadVertical"),
  salida: z.string().optional(),
  props: z.record(z.string(), z.unknown()),
});

const args = process.argv.slice(2);
const archivos = args.length
  ? args.map((a) => path.resolve(a))
  : (await readdir(path.join(RAIZ, "datos"))).filter((f) => f.endsWith(".json")).map((f) => path.join(RAIZ, "datos", f));

if (!archivos.length) {
  console.log("No hay archivos .json en datos/.");
  process.exit(0);
}

const fallar = (mensaje: string): never => {
  console.error(`✖ ${mensaje}`);
  process.exit(1);
};

// 1) Validar todo antes de renderizar nada.
const trabajos = await Promise.all(
  archivos.map(async (archivo) => {
    const t = trabajoSchema.parse(JSON.parse(await readFile(archivo, "utf8")));
    const esquema = ESQUEMAS[t.composicion];
    if (!esquema) return fallar(`${path.basename(archivo)}: composición desconocida "${t.composicion}"`);
    const r = esquema.safeParse(t.props);
    if (!r.success) return fallar(`${path.basename(archivo)}: datos no válidos\n${z.prettifyError(r.error)}`);
    const salida = path.resolve(RAIZ, t.salida ?? `out/${path.basename(archivo, ".json")}.mp4`);
    return { archivo, composicion: t.composicion, props: t.props, salida };
  }),
);

// 2) Empaquetar una sola vez y renderizar cada pieza.
console.log("Empaquetando…");
const serveUrl = await bundle({ entryPoint: path.join(RAIZ, "src/index.ts"), publicDir: path.join(RAIZ, "public") });
const browserExecutable = process.env.REMOTION_NAVEGADOR ?? null;

for (const t of trabajos) {
  const composition = await selectComposition({ serveUrl, id: t.composicion, inputProps: t.props, browserExecutable });
  console.log(`▶ ${path.basename(t.archivo)} → ${path.relative(RAIZ, t.salida)} (${(composition.durationInFrames / composition.fps).toFixed(1)} s)`);
  let ultimo = -1;
  await renderMedia({
    serveUrl,
    composition,
    inputProps: t.props,
    codec: "h264",
    pixelFormat: "yuv420p",
    crf: 18,
    outputLocation: t.salida,
    browserExecutable,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== ultimo) process.stdout.write(`  ${(ultimo = pct)}%`);
    },
  });
  console.log("\n  ✓ listo");
}
