# ADR 0002 — Estación de Dirección en computadora

Fecha: 2026-11-03 · Estado: aceptada (pendiente de validar en Etapa 0)

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

## Actualización — equipo confirmado

- Computadora: **Windows**. Windows no recibe AirPlay de forma nativa: se necesita un programa receptor AirPlay. En Etapa 0 se probarán versiones gratuitas o de prueba antes de comprar ninguna licencia.
- Internet en campo: **sí**.
- Plan B si la duplicación por AirPlay falla o tiene demasiado retraso: la estación funciona sin vista en vivo (plan, voz, checklist, registro de tomas) y el análisis visual se hace al terminar cada batería con los clips descargados.

## Actualización — Control directo del dron (investigado 2026-11-03)

- El SDK móvil de DJI (MSDK v5) **solo funciona en Android** y su lista de modelos compatibles no incluye el DJI Flip (pendiente de confirmar en developer.dji.com).
- Con DJI Flip + iPhone **no existe vía para que un software envíe órdenes de vuelo**. La conexión Claude ↔ dron es visual (AirPlay) y por voz al piloto.
- Si en el futuro se quiere integración directa (p. ej. Claude propone rutas y el piloto las confirma), haría falta un dron compatible con MSDK v5 y un dispositivo Android con app propia. Sería un proyecto aparte, sujeto a la normativa de la DGAC.
- Computadora: también se probará con **MacBook**, que recibe AirPlay de forma nativa.
