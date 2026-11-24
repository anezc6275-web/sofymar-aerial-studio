import { Fragment } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { esClaro, textoSobre } from "./color";
import { useTema } from "./contexto";
import type { AnimacionTexto } from "./esquemas";


type Palabra = { texto: string; destacada: boolean };

/** "Hola *mundo feliz*" → palabras, marcando como destacadas las que van entre asteriscos. */
export const separarPalabras = (texto: string): Palabra[] =>
  texto
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .flatMap((trozo) => {
      const destacada = trozo.startsWith("*") && trozo.endsWith("*");
      return trozo
        .replace(/^\*|\*$/g, "")
        .split(/\s+/)
        .filter(Boolean)
        .map((t) => ({ texto: t, destacada }));
    });

type Props = {
  texto: string;
  animacion?: AnimacionTexto;
  tamano: number;
  retraso?: number;
  tipo?: "titulo" | "texto";
  color?: string;
  colorDestacado?: string;
  alineacion?: "left" | "center" | "right";
  peso?: number;
  mayusculas?: boolean;
  sombra?: boolean;
  alturaLinea?: number;
  estilo?: React.CSSProperties;
};

/** Texto con animación de entrada. Admite *palabras destacadas* con asteriscos. */
export const TextoAnimado: React.FC<Props> = ({
  texto,
  animacion = "palabras",
  tamano,
  retraso = 0,
  tipo = "titulo",
  color,
  colorDestacado,
  alineacion = "left",
  peso,
  mayusculas,
  sombra = true,
  alturaLinea = 1.08,
  estilo,
}) => {
  const frame = useCurrentFrame();
  const { tema, fuenteTitulos, fuenteTexto, pesoTitulos, entrada, suave, escalonado } = useTema();
  const f = frame - retraso;
  const palabras = separarPalabras(texto);
  const colorBase = color ?? tema.colorTexto;
  const resalte = colorDestacado ?? tema.colorPrimario;
  const esTitulo = tipo === "titulo";

  const contenedor: React.CSSProperties = {
    fontFamily: esTitulo ? fuenteTitulos : fuenteTexto,
    fontWeight: peso ?? (esTitulo ? pesoTitulos : 500),
    fontSize: tamano,
    lineHeight: alturaLinea,
    color: colorBase,
    textAlign: alineacion,
    textTransform: (mayusculas ?? (esTitulo && tema.mayusculasTitulos)) ? "uppercase" : "none",
    // La sombra solo ayuda a texto claro; en temas claros (texto oscuro) ensucia.
    textShadow: sombra && esClaro(colorBase) ? "0 6px 30px rgba(0,0,0,0.35)" : "none",
    letterSpacing: tema.fuenteTitulos === "bebas" && esTitulo ? "0.02em" : "-0.01em",
    ...estilo,
  };

  const decorar = (p: Palabra, aparicion: number): React.CSSProperties => {
    if (!p.destacada) return {};
    const m = interpolate(aparicion, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    if (tema.estiloDestacado === "marcador") {
      return {
        backgroundImage: `linear-gradient(${resalte}, ${resalte})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 50%",
        backgroundSize: `${m * 100}% 100%`,
        padding: "0 0.12em",
        borderRadius: "0.08em",
        color: m > 0.5 ? textoSobre(resalte) : undefined,
        textShadow: "none",
      };
    }
    if (tema.estiloDestacado === "subrayado") {
      return {
        backgroundImage: `linear-gradient(${resalte}, ${resalte})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 100%",
        backgroundSize: `${m * 100}% 0.09em`,
      };
    }
    return { color: resalte };
  };

  // Animaciones que tratan el texto como bloque.
  if (animacion === "desenfoque" || animacion === "aparecer") {
    const p = suave(f, 0, animacion === "desenfoque" ? 35 : 20);
    return (
      <div
        style={{
          ...contenedor,
          opacity: p,
          filter: animacion === "desenfoque" ? `blur(${(1 - p) * 18}px)` : undefined,
          letterSpacing: animacion === "desenfoque" ? `${interpolate(p, [0, 1], [0.35, -0.01])}em` : contenedor.letterSpacing,
          transform: animacion === "aparecer" ? `translateY(${(1 - p) * 24}px)` : `scale(${interpolate(p, [0, 1], [1.08, 1])})`,
        }}
      >
        {palabras.map((p2, i) => (
          <Fragment key={i}>
            <span style={decorar(p2, p)}>{p2.texto}</span>{" "}
          </Fragment>
        ))}
      </div>
    );
  }

  if (animacion === "maquina") {
    const total = palabras.map((p) => p.texto).join(" ").length;
    const visibles = Math.max(0, Math.floor(f / 1.6));
    let restantes = visibles;
    const cursor = Math.floor(frame / 15) % 2 === 0 || visibles < total;
    return (
      <div style={contenedor}>
        {palabras.map((p, i) => {
          const n = Math.max(0, Math.min(p.texto.length, restantes));
          restantes -= p.texto.length + 1;
          return (
            <Fragment key={i}>
              <span style={decorar(p, n === p.texto.length ? 1 : 0)}>{p.texto.slice(0, n)}</span>
              {n === p.texto.length && i < palabras.length - 1 ? " " : ""}
            </Fragment>
          );
        })}
        <span style={{ opacity: cursor ? 1 : 0, color: resalte, marginLeft: 4 }}>|</span>
      </div>
    );
  }

  let indiceLetra = 0;
  return (
    <div style={contenedor}>
      {palabras.map((p, i) => {
        const inicio = i * escalonado;
        const ap = animacion === "deslizar" ? suave(f, inicio, 22) : entrada(f, inicio);

        if (animacion === "letras") {
          const letras = p.texto.split("").map((c) => {
            const k = indiceLetra++;
            const a = entrada(f, k * 1.2);
            return (
              <span
                key={k}
                style={{
                  display: "inline-block",
                  opacity: Math.min(1, a * 1.5),
                  transform: `translateY(${(1 - a) * 0.5}em) rotate(${(1 - a) * 8}deg)`,
                }}
              >
                {c}
              </span>
            );
          });
          indiceLetra++;
          return (
            <Fragment key={i}>
              <span style={{ display: "inline-block", ...decorar(p, entrada(f, (indiceLetra - 1) * 1.2)) }}>{letras}</span>{" "}
            </Fragment>
          );
        }

        if (animacion === "deslizar") {
          return (
            <Fragment key={i}>
              <span style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.08em" }}>
                <span style={{ display: "inline-block", transform: `translateY(${(1 - ap) * 110}%)`, ...decorar(p, ap) }}>
                  {p.texto}
                </span>
              </span>{" "}
            </Fragment>
          );
        }

        const transform =
          animacion === "escala"
            ? `scale(${interpolate(ap, [0, 1], [0.3, 1])})`
            : `translateY(${(1 - ap) * 0.6}em)`;
        return (
          <Fragment key={i}>
            <span
              style={{
                display: "inline-block",
                opacity: Math.min(1, ap * 1.4),
                transform,
                filter: animacion === "palabras" ? `blur(${Math.max(0, 1 - ap) * 10}px)` : undefined,
                ...decorar(p, ap),
              }}
            >
              {p.texto}
            </span>{" "}
          </Fragment>
        );
      })}
    </div>
  );
};
