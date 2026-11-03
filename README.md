# Sofymar Aerial Studio

Plataforma SaaS white-label de producción audiovisual inmobiliaria con IA: director audiovisual inteligente y copiloto de producción para operadores de drones (DJI Flip + RC-N3 + iPhone + DJI Fly + Claude).

> Claude actúa como copiloto externo. El piloto conserva siempre el control del dron.

## Documentación

- [Arquitectura](docs/arquitectura.md)
- [Decisiones (ADR)](docs/adr/)

## Estado

**Etapa 0** en curso: Estación de Dirección funcionando en modo simulado (gratis).
Guía de prueba en Windows: [docs/etapa-0.md](docs/etapa-0.md)

## Inicio rápido

```bash
corepack enable
pnpm install
cp .env.example .env
pnpm dev
```

Abrir http://localhost:3000/estacion

## Estructura

| Carpeta | Contenido |
|---|---|
| `apps/web` | PWA Next.js: Estación de Dirección |
| `apps/api` | API Fastify: análisis de fotogramas (simulado o Claude), límite de gasto diario |
| `packages/shared` | Esquemas y tipos compartidos, plan de tomas de demostración |
| `packages/ai` | Prompts versionados e integración con Claude |
| `packages/media` | Inspección de archivos del dron y extracción de fotogramas (FFmpeg) |
| `infra` | Docker Compose (Postgres + MinIO) para la Etapa 1 |
