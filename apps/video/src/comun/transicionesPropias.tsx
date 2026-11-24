import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { AbsoluteFill, interpolate } from "remotion";

type SinProps = Record<string, never>;

/** Zoom cinematográfico: la escena saliente se agranda y se desvanece; la entrante llega desde más pequeña. */
const Zoom: React.FC<TransitionPresentationComponentProps<SinProps>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const sale = presentationDirection === "exiting";
  const escala = sale ? interpolate(p, [0, 1], [1, 1.35]) : interpolate(p, [0, 1], [0.85, 1]);
  return (
    <AbsoluteFill style={{ transform: `scale(${escala})`, opacity: sale ? 1 - p : p, filter: `blur(${(sale ? p : 1 - p) * 6}px)` }}>
      {children}
    </AbsoluteFill>
  );
};

/** Fundido con desenfoque: muy suave, tipo sueño. */
const Desenfoque: React.FC<TransitionPresentationComponentProps<SinProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const sale = presentationDirection === "exiting";
  const b = sale ? p : 1 - p;
  return <AbsoluteFill style={{ opacity: sale ? 1 - p : p, filter: `blur(${b * 24}px)` }}>{children}</AbsoluteFill>;
};

export const zoom = (): TransitionPresentation<SinProps> => ({ component: Zoom, props: {} });
export const desenfoque = (): TransitionPresentation<SinProps> => ({ component: Desenfoque, props: {} });
