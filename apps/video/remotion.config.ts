// Configuración de Remotion CLI (studio y render).
// https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// H.264 + yuv420p: máxima compatibilidad con Instagram Reels, TikTok y YouTube Shorts.
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(18);
