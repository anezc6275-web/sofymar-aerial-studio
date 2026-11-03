# Sofymar Aerial Studio — Arquitectura (Fase 1)

Estado: **propuesta aprobada para iniciar Etapa 0** · Fecha: 2026-11-03
Contexto operativo: **Santa Cruz de la Sierra, Bolivia** · Idioma: **español**

## Principios

- Claude es **copiloto externo**, nunca controlador de vuelo. El piloto opera el DJI Flip con DJI Fly + RC-N3.
- Claude no ve vídeo: FFmpeg extrae fotogramas/metadatos y Claude analiza imágenes y texto.
- Claude no edita vídeo: genera una **EDL (lista de decisiones de edición) en JSON validado** que FFmpeg ejecuta.
- La clave de Anthropic vive solo en el backend; cada llamada se registra (tenant, tokens, coste).
- Multi-tenant desde el día 1 (primer tenant: Sofymar), con Row-Level Security en Postgres.
- Mínimas piezas de infraestructura; nada se contrata sin justificar y aprobar.

## 1. Arquitectura general

```
iPhone/iPad (PWA)  ──HTTPS/SSE──▶  API (Node/TS)  ──▶  PostgreSQL (+RLS, cola pg-boss)
       │                              │  └──────▶  API de Anthropic (solo backend)
       │ subida directa prefirmada    ▼
       └──────────────▶  Almacenamiento S3-compatible  ◀── Worker FFmpeg
```

## 2. Tecnologías

| Capa | Elección |
|---|---|
| Frontend | Next.js + React + TypeScript + Tailwind, PWA mobile-first |
| API | Fastify (Node/TypeScript) |
| ORM | Drizzle |
| Validación | Zod (compartido front/API/salidas de Claude) |
| Cola | pg-boss sobre Postgres |
| Medios | FFmpeg + ffprobe en contenedor worker |
| Auth | Better Auth (self-hosted) con passkeys / Face ID |
| IA | SDK oficial `@anthropic-ai/sdk` |
| Monorepo | pnpm + Turborepo |
| Local | Docker Compose (Postgres + MinIO) |

## 3. Servicios cloud (se contratan solo al pasar a producción)

| Servicio | Opción recomendada | Nota para Bolivia |
|---|---|---|
| API Anthropic | Cuenta API con límite de gasto | Pago en USD con tarjeta internacional (ver Riesgos) |
| PostgreSQL | Neon / Supabase / Railway | Región más cercana: **São Paulo** |
| Objetos | Cloudflare R2 (sin coste de salida) | Red global, buena latencia en Sudamérica |
| API + worker | Railway / Fly.io | Región São Paulo si está disponible |
| Email | Resend (Etapa 5) | — |
| Errores | Sentry (gratis) | — |
| STT/TTS de pago | Solo si la voz nativa falla en campo | Español latinoamericano |
| Cobros SaaS | **Por definir** (Etapa 6) | Stripe no opera con empresas en Bolivia: evaluar Merchant of Record (Paddle / Lemon Squeezy) o cobro local (QR) |

## 4. Estructura del repositorio

```
apps/web        PWA (director, admin, portal cliente)
apps/api        REST + SSE, auth, orquestación IA
apps/worker     FFmpeg, análisis, render, exports
packages/db     esquema, migraciones, seeds
packages/ai     prompts versionados, esquemas de salida, tools
packages/media  pipelines FFmpeg
packages/shared tipos, permisos, constantes
packages/ui     componentes y theming white-label
infra/          docker-compose, despliegue
docs/           arquitectura, ADRs, biblioteca de tomas
```

## 5. Modelo de datos

- **Plataforma:** tenants, tenant_branding, plans, subscriptions, usage_counters
- **Identidad:** users, memberships (rol), invitations, sessions, passkeys
- **Comercial:** clients, properties (dirección, coordenadas, tipo, m², atributos)
- **Producción:** productions (borrador → planificada → en vuelo → en edición → en revisión → entregada), production_briefs
- **Planificación:** shot_plans (versionados), planned_shots, scripts
- **Biblioteca:** shot_templates, music_tracks (con licencia)
- **Campo:** flight_sessions, checklists, checklist_items, field_notes, shot_status
- **Media:** assets, asset_frames, asset_telemetry
- **IA:** analyses, shot_matches, ai_interactions (modelo, tokens, coste, versión de prompt)
- **Edición:** edit_projects, edit_decision_lists, render_jobs, exports
- **Entrega:** deliveries, review_comments, audit_log

Toda tabla de negocio lleva `tenant_id` + RLS.

## 6. Usuarios y permisos

| Rol | Ámbito | Capacidades |
|---|---|---|
| Superadmin plataforma (Sofymar) | Global | tenants, uso y costes, soporte |
| Propietario de tenant | Tenant | todo + branding + facturación |
| Admin de tenant | Tenant | usuarios, clientes, supervisión |
| Director audiovisual | Producciones | planificar, volar, subir, analizar, editar, entregar |
| Editor (futuro) | Producciones asignadas | media, edición, exportación |
| Cliente / revisor | Enlace o portal | ver, comentar, aprobar |

Permisos como capacidades (`production:edit`, `media:upload`…), no roles cableados.

## 7. Voz

Capas, de menor a mayor coste:
1. **Nativa:** reconocimiento de voz de Safari + `speechSynthesis` de iOS (es-419/es-ES). Coste 0.
2. **Servidor:** push-to-talk → STT de pago.
3. **Premium:** TTS neural con voz de marca.

Push-to-talk (no escucha continua), intenciones rápidas sin IA ("siguiente toma", "repetir", "marcar hecha"), plan cacheado offline.

**Restricción iPhone:** el iPhone del RC-N3 ejecuta DJI Fly; las PWA se suspenden en segundo plano. **Decisión (ADR 0002):** la voz y el copiloto corren en una **Estación de Dirección en computadora**, que recibe la pantalla del iPhone por AirPlay, analiza fotogramas en vivo con Claude y habla al piloto por auriculares Bluetooth.

## 8. Integración con Claude

- Modelo por defecto: **Claude Opus 5.5** (`claude-opus-5-5`). Esfuerzo por tarea: `low` voz, `medium` clasificación, `high` planes/guiones/EDL.
- Opcional (decisión del propietario): Claude Haiku 5.5 para clasificación masiva si la calidad lo permite.
- Salidas estructuradas (JSON Schema + Zod) para planes, análisis y EDL.
- Visión sobre fotogramas representativos + contexto del plan.
- Tool use en el copiloto: get_current_shot, mark_shot, add_note, get_checklist, get_weather_context.
- Prompt caching de system prompt y biblioteca; Batch API para análisis no urgentes.
- Manejo de `stop_reason` (incl. refusal), reintentos y fallback.
- Todas las respuestas en español; Claude recuerda límites legales/de seguridad, el piloto decide.

## 9. Flujo del Director Audiovisual

1. Alta (cliente, inmueble, objetivos, formatos)
2. Plan generado por Claude (brief, guion, tomas, hora de luz, riesgos)
3. Aprobación y ajustes
4. Pre-vuelo: checklist (meteo/viento, espacio aéreo y autorizaciones DGAC, baterías, ND, tarjeta)
5. Vuelo con copiloto toma a toma
6. Ingesta (subida reanudable, proxies, fotogramas)
7. Análisis en el propio inmueble: calidad, clasificación, tomas faltantes
8. Edición: EDL propuesta por Claude → render FFmpeg con branding
9. Revisión del cliente
10. Entrega: 16:9, 9:16, 1:1, 4:5 + fotos

## 10. Etapas

| Etapa | Contenido |
|---|---|
| 0 | Monorepo, Docker local, CI; pruebas técnicas en iPhone real (voz PWA, exportación DJI Fly/microSD, FFmpeg con archivos del Flip) |
| 1 | Auth + roles, multi-tenant, clientes, inmuebles, producciones, biblioteca, generador de planes |
| 2 | Copiloto de campo: **Estación de Dirección** en computadora (vista en vivo vía AirPlay, análisis visual en vivo, voz al piloto), checklists, offline |
| 3 | Media e IA: subida, proxies, análisis, clasificación |
| 4 | Edición automática y exportación (requiere resolver música con licencia) |
| 5 | Admin, costes de IA, portal cliente, emails |
| 6 | SaaS white-label: tenants, dominios, planes, cobros |

## Riesgos y pendientes

- **Normativa:** la operación de drones en Bolivia la regula la DGAC. Los checklists deben basarse en la reglamentación vigente, que hay que verificar con la DGAC (no asumir reglas de EASA/FAA).
- **Pagos internacionales:** las restricciones de divisas en Bolivia pueden limitar el pago en USD de servicios cloud y de la API. Confirmar tarjeta/medio de pago antes de la Etapa 1.
- **Música:** no hay biblioteca con licencia. Definir en Etapa 4 (suscripción con licencia comercial para redes y portales inmobiliarios).
- **Pendientes de decisión:** tipo de computadora (Mac/Windows); conexión a internet en campo; presupuesto mensual del piloto.
