import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { AreaSegura } from "../../comun/AreaSegura";
import { alfa } from "../../comun/color";
import { useTema } from "../../comun/contexto";
import { FondoEscena } from "../../comun/Fondo";
import { resolverRecurso } from "../../comun/recursos";
import { TextoAnimado } from "../../comun/TextoAnimado";
import { ALTO, ANCHO, ZONA_SEGURA } from "../../constantes";
import type { EscenaDe } from "../schema";

const AREA_ANCHO = ANCHO - ZONA_SEGURA.izquierda - ZONA_SEGURA.derecha;
const AREA_ALTO = ALTO - ZONA_SEGURA.arriba - ZONA_SEGURA.abajo;
const SEP = 22;

type Caja = { x: number; y: number; w: number; h: number };

const cajas = (n: number, disposicion: "cuadricula" | "mosaico", alto: number): Caja[] => {
  const col = (AREA_ANCHO - SEP) / 2;
  if (n === 1) return [{ x: 0, y: 0, w: AREA_ANCHO, h: alto }];
  if (disposicion === "mosaico") {
    const resto = n - 1;
    const filas = Math.ceil(resto / 2);
    const grande = alto * (filas > 1 ? 0.42 : 0.55);
    const h = (alto - grande - SEP * filas) / filas;
    return [
      { x: 0, y: 0, w: AREA_ANCHO, h: grande },
      ...Array.from({ length: resto }, (_, i) => {
        const fila = Math.floor(i / 2);
        const sola = i === resto - 1 && resto % 2 === 1;
        return { x: sola ? 0 : (i % 2) * (col + SEP), y: grande + SEP + fila * (h + SEP), w: sola ? AREA_ANCHO : col, h };
      }),
    ];
  }
  const filas = Math.ceil(n / 2);
  const h = (alto - SEP * (filas - 1)) / filas;
  return Array.from({ length: n }, (_, i) => {
    const sola = i === n - 1 && n % 2 === 1;
    return { x: sola ? 0 : (i % 2) * (col + SEP), y: Math.floor(i / 2) * (h + SEP), w: sola ? AREA_ANCHO : col, h };
  });
};

/** Imagen de apoyo con marco redondeado; sin fuente muestra un marcador de posición. */
const Tarjeta: React.FC<{ fuente: string; indice: number; zoom: number }> = ({ fuente, indice, zoom }) => {
  const { tema, fuenteTexto } = useTema();
  return (
    <div style={{ width: "100%", height: "100%", borderRadius: 28, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.45)" }}>
      {fuente ? (
        <Img src={resolverRecurso(fuente)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
      ) : (
        <AbsoluteFill
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            background: `linear-gradient(${135 + indice * 40}deg, ${tema.colorPrimario}, ${tema.colorSecundario})`,
            color: alfa("#FFFFFF", 0.9),
            fontFamily: fuenteTexto,
            fontSize: 34,
            fontWeight: 600,
          }}
        >
          <svg width={90} height={72} viewBox="0 0 24 19" fill="none" stroke="currentColor" strokeWidth={1.4}>
            <rect x="1" y="1" width="22" height="17" rx="2" />
            <circle cx="8" cy="7" r="2" />
            <path d="M1 15l6-5 5 4 4-3 7 5" />
          </svg>
          Imagen {indice + 1}
        </AbsoluteFill>
      )}
    </div>
  );
};

export const Galeria: React.FC<{ escena: EscenaDe<"galeria">; duracion: number; indice: number }> = ({ escena, duracion, indice }) => {
  const frame = useCurrentFrame();
  const { entrada } = useTema();
  const altoTitulo = escena.titulo ? 150 : 0;
  const alto = AREA_ALTO - altoTitulo;
  const zoom = interpolate(frame, [0, duracion], [1.12, 1]);

  let contenido: React.ReactNode;
  if (escena.disposicion === "carrusel") {
    const n = escena.imagenes.length;
    const tramo = duracion / n;
    const posicion = escena.imagenes.reduce((acc, _, i) => {
      if (i === 0) return acc;
      return acc + interpolate(frame, [i * tramo - 12, i * tramo + 6], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      });
    }, 0);
    contenido = escena.imagenes.map((fuente, i) => {
      const d = i - posicion;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            top: altoTitulo,
            width: AREA_ANCHO,
            height: alto,
            transform: `perspective(1600px) translateX(${d * (AREA_ANCHO + 60)}px) rotateY(${d * -18}deg) scale(${1 - Math.min(1, Math.abs(d)) * 0.12})`,
            opacity: 1 - Math.min(1, Math.abs(d)) * 0.6,
          }}
        >
          <Tarjeta fuente={fuente} indice={i} zoom={zoom} />
        </div>
      );
    });
  } else {
    contenido = cajas(escena.imagenes.length, escena.disposicion, alto).map((c, i) => {
      const a = entrada(frame, 6 + i * 6);
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: c.x,
            top: altoTitulo + c.y,
            width: c.w,
            height: c.h,
            opacity: Math.min(1, a * 1.5),
            transform: `translateY(${(1 - a) * 80}px) scale(${0.85 + a * 0.15})`,
          }}
        >
          <Tarjeta fuente={escena.imagenes[i] ?? ""} indice={i} zoom={zoom} />
        </div>
      );
    });
  }

  return (
    <>
      <FondoEscena fondo={escena.fondo} duracion={duracion} semilla={indice + 20} />
      <AreaSegura posicion="arriba" gap={0}>
        <div style={{ position: "relative", width: AREA_ANCHO, height: AREA_ALTO }}>
          {escena.titulo ? <TextoAnimado texto={escena.titulo} animacion="deslizar" tamano={78} /> : null}
          {contenido}
        </div>
      </AreaSegura>
    </>
  );
};
