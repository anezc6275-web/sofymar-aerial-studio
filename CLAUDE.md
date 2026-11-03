# CLAUDE.md

## Proyecto
Sofymar Aerial Studio. Ver `docs/arquitectura.md` y `docs/adr/`.

## Reglas
- Idioma del producto, UI, prompts y documentación: **español**.
- No instalar ni contratar servicios de pago sin aprobación explícita del propietario.
- Claude es copiloto externo: nunca generar funciones de control de vuelo.
- Toda tabla de negocio lleva `tenant_id` y RLS.
- La clave de Anthropic solo en backend; registrar cada llamada en `ai_interactions`.
- Salidas de Claude siempre estructuradas y validadas con Zod.
- Registrar decisiones relevantes como ADR en `docs/adr/`.
