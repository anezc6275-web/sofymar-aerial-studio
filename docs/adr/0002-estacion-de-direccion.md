# ADR 0002 — Estación de Dirección en computadora

Fecha: 2026-11-03 · Estado: propuesta (pendiente de validar en Etapa 0)

## Contexto

En campo habrá un solo iPhone, montado en el RC-N3 con DJI Fly, para ver lo que se filma. El propietario quiere un segundo equipo, una **computadora**, donde Claude dé las directrices y donde se tenga el control de la producción, con más inteligencia artificial.

Restricciones:
- El iPhone del mando está ocupado por DJI Fly y su puerto por el cable del RC-N3.
- No se asume que el DJI Flip admita control autónomo por SDK: Claude no pilota.

## Decisión

Crear una **Estación de Dirección** (vista de escritorio de la misma PWA) que funciona como cerebro del copiloto en campo:

1. **Vista en vivo:** el iPhone duplica su pantalla (AirPlay) hacia la computadora (Mac como receptor AirPlay). La estación captura esa ventana con la API de captura de pantalla del navegador.
2. **Análisis visual en vivo:** cada N segundos (configurable, p. ej. 3–5 s) se envía un fotograma a Claude, que evalúa encuadre, horizonte, exposición, altura y si la toma cumple el plan.
3. **Voz al piloto:** la computadora habla al piloto por auriculares Bluetooth; el piloto responde por voz (push-to-talk). El iPhone queda libre para DJI Fly.
4. **Control de producción:** plan de tomas, estado de cada toma (hecha / repetir), cronómetro por batería, notas y checklist, todo desde la computadora.
5. **El piloto conserva el control del dron** en todo momento.

## A validar en Etapa 0 (prueba técnica)

- Que DJI Fly permita duplicar pantalla por AirPlay sin bloquear el vídeo.
- Latencia de la duplicación y de la respuesta de Claude.
- Conexión en campo: AirPlay necesita red local; Claude necesita internet (router 4G o punto de acceso).
- Computadora disponible: Mac (receptor AirPlay nativo) o Windows (requiere software receptor de terceros).
- Coste por minuto del análisis en vivo y frecuencia de fotogramas adecuada.

## Alternativas descartadas

- PWA de copiloto en el mismo iPhone: iOS la suspende en segundo plano mientras DJI Fly está en pantalla.
- Control autónomo del vuelo: no soportado/asumido con DJI Flip; fuera de alcance.
