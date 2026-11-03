import Link from "next/link";

export default function Home() {
  return (
    <main className="home">
      <h1>Sofymar Aerial Studio</h1>
      <p className="muted">Director audiovisual inteligente · Etapa 0 (prueba técnica)</p>
      <Link className="card-link" href="/estacion">
        <strong>Estación de Dirección</strong>
        <span>Vista en vivo de DJI Fly, análisis de fotogramas y copiloto por voz.</span>
      </Link>
      <p className="muted small">
        El piloto conserva siempre el control del dron. Claude actúa como copiloto externo.
      </p>
    </main>
  );
}
