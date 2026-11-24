"""Genera los efectos de sonido y la música de demostración de la plantilla.

Todo se sintetiza aquí (sin muestras de terceros), así que no hay problemas de licencia.
Requisitos: python3 con numpy y scipy, y ffmpeg para la música en MP3.
Uso (desde apps/video):  python3 scripts/generar-sonidos.py
"""
import subprocess
import wave
from pathlib import Path

import numpy as np
from scipy.signal import butter, sosfilt

SR = 44100
RAIZ = Path(__file__).resolve().parent.parent / "public"
rng = np.random.default_rng(7)


def t(dur):
    return np.arange(int(SR * dur)) / SR


def guardar(nombre, señal, pan=None):
    señal = np.asarray(señal, dtype=np.float64)
    if señal.ndim == 1:
        if pan is None:
            pan = np.zeros_like(señal)
        izq = señal * np.sqrt(0.5 * (1 - pan))
        der = señal * np.sqrt(0.5 * (1 + pan))
        señal = np.stack([izq, der], axis=1)
    pico = np.max(np.abs(señal)) or 1
    señal = señal / pico * 0.89
    # fundido mínimo para evitar clics
    n = min(256, len(señal) // 4)
    rampa = np.linspace(0, 1, n)[:, None]
    señal[:n] *= rampa
    señal[-n:] *= rampa[::-1]
    datos = (señal * 32767).astype("<i2")
    ruta = RAIZ / nombre
    ruta.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(ruta), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(datos.tobytes())
    return ruta


def filtro_movil(ruido, cortes, tipo="lowpass", bloques=64):
    """Filtra por bloques con una frecuencia de corte que cambia en el tiempo."""
    salida = np.zeros_like(ruido)
    trozos = np.array_split(np.arange(len(ruido)), bloques)
    for i, idx in enumerate(trozos):
        fc = float(np.clip(cortes[idx[len(idx) // 2]], 40, SR / 2.2))
        sos = butter(2, fc, btype=tipo, fs=SR, output="sos")
        salida[idx] = sosfilt(sos, ruido[idx])
    return salida


def envolvente(tt, ataque, total, curva=2.0):
    sube = np.clip(tt / ataque, 0, 1)
    baja = np.clip((total - tt) / (total - ataque), 0, 1) ** curva
    return np.where(tt < ataque, sube, baja)


def whoosh(dur=0.7, fc_min=300, fc_max=6000, nombre="sonidos/whoosh.wav"):
    tt = t(dur)
    ruido = rng.standard_normal(len(tt))
    forma = np.sin(np.pi * tt / dur) ** 1.5
    señal = filtro_movil(ruido, fc_min + (fc_max - fc_min) * forma) * forma
    return guardar(nombre, señal, pan=np.linspace(-0.8, 0.8, len(tt)))


def pop():
    tt = t(0.14)
    f = 900 * np.exp(-tt * 18) + 250
    fase = 2 * np.pi * np.cumsum(f) / SR
    return guardar("sonidos/pop.wav", np.sin(fase) * np.exp(-tt * 30))


def click():
    tt = t(0.05)
    tono = np.sin(2 * np.pi * 2200 * tt) * np.exp(-tt * 120)
    golpe = rng.standard_normal(len(tt)) * np.exp(-tt * 600) * 0.5
    return guardar("sonidos/click.wav", tono + golpe)


def impacto():
    tt = t(1.4)
    f = 110 * np.exp(-tt * 6) + 42
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2)
    ruido = sosfilt(butter(2, 900, fs=SR, output="sos"), rng.standard_normal(len(tt))) * np.exp(-tt * 14) * 2
    return guardar("sonidos/impacto.wav", np.tanh((sub + ruido) * 1.6))


def brillo():
    tt = t(1.3)
    señal = np.zeros_like(tt)
    for i, f in enumerate([2093, 2637, 3136, 4186, 5274]):
        inicio = i * 0.06
        local = np.clip(tt - inicio, 0, None)
        señal += (tt >= inicio) * np.sin(2 * np.pi * f * local) * np.exp(-local * 4.5)
    señal *= 1 + 0.3 * np.sin(2 * np.pi * 9 * tt)
    return guardar("sonidos/brillo.wav", señal, pan=np.sin(2 * np.pi * 1.5 * tt) * 0.6)


def riser():
    tt = t(1.6)
    progreso = tt / tt[-1]
    f = 180 + 1400 * progreso**2
    tono = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.4
    ruido = filtro_movil(rng.standard_normal(len(tt)), 400 + 9000 * progreso**2, tipo="highpass")
    return guardar("sonidos/riser.wav", (tono + ruido) * progreso**2.2)


def nota(freq):
    return 440 * 2 ** ((freq - 69) / 12)


def musica_demo():
    """Loop de 32 s a 120 BPM: pad + bajo + bombo suave + charles."""
    bpm, compases = 120, 16
    negra = 60 / bpm
    dur = compases * 4 * negra
    tt = t(dur)
    acordes = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]] * 2  # Am F C G
    pad = np.zeros_like(tt)
    bajo = np.zeros_like(tt)
    largo = dur / len(acordes)
    for i, acorde in enumerate(acordes):
        m = (tt >= i * largo) & (tt < (i + 1) * largo)
        local = tt[m] - i * largo
        env = np.clip(local / 0.4, 0, 1) * np.clip((largo - local) / 0.4, 0, 1)
        for n in acorde:
            for desafinado in (-0.12, 0.12):
                f = nota(n + desafinado)
                for armonico, amp in ((1, 1), (2, 0.35), (3, 0.15)):
                    pad[m] += np.sin(2 * np.pi * f * armonico * local) * amp * env
        bajo[m] += np.sin(2 * np.pi * nota(acorde[0] - 12) * local) * env
    pad = sosfilt(butter(2, 1800, fs=SR, output="sos"), pad) * 0.18
    bajo *= 0.35 * (0.6 + 0.4 * np.abs(np.sin(np.pi * tt / negra)))

    bombo = np.zeros_like(tt)
    charles = np.zeros_like(tt)
    gl = t(0.35)
    golpe = np.sin(2 * np.pi * np.cumsum(120 * np.exp(-gl * 25) + 45) / SR) * np.exp(-gl * 9)
    ch = t(0.06)
    hat = sosfilt(butter(2, 7000, btype="highpass", fs=SR, output="sos"), rng.standard_normal(len(ch))) * np.exp(-ch * 70)
    for k in range(compases * 4):
        a = int(k * negra * SR)
        bombo[a : a + len(golpe)] += golpe[: len(bombo) - a]
        b = int((k + 0.5) * negra * SR)
        if b < len(charles):
            charles[b : b + len(hat)] += hat[: len(charles) - b]
    mezcla = pad + bajo + bombo * 0.55 + charles * 0.12
    wav = guardar("musica/_demo.wav", mezcla)
    mp3 = RAIZ / "musica/demo-ambiente.mp3"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-b:a", "160k", str(mp3)], check=True)
    wav.unlink()
    return mp3


if __name__ == "__main__":
    rutas = [
        whoosh(),
        whoosh(1.0, 150, 2500, "sonidos/swoosh-suave.wav"),
        pop(),
        click(),
        impacto(),
        brillo(),
        riser(),
        musica_demo(),
    ]
    for r in rutas:
        print("✓", r.relative_to(RAIZ.parent))
