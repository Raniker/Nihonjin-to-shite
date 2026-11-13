"""Genera los iconos de la PWA en icons/.

Uso (desde la raíz del proyecto):  python tools/make-icons.py
Requiere Pillow (pip install pillow) y la fuente Yu Gothic de Windows.

Se generan dos tipos de icono:
- "any": cuadrado con esquinas redondeadas; se usa tal cual (pestañas, escritorio).
- "maskable": fondo hasta los bordes. Android lo recorta con la forma que use
  el launcher (círculo, gota, cuadrado...), así que el dibujo importante debe
  quedar dentro de la "zona segura": un círculo central del 80 % del tamaño.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

CREAM = "#faf7f2"
RED = "#c0392b"
FONT = "C:/Windows/Fonts/YuGothB.ttc"  # Yu Gothic Bold
OUT = Path(__file__).resolve().parent.parent / "icons"


def draw_icon(size, maskable):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    if maskable:
        d.rectangle([0, 0, size, size], fill=CREAM)
        sun = size * 0.30  # radio del sol, dentro de la zona segura (0.40)
    else:
        d.rounded_rectangle([0, 0, size - 1, size - 1], radius=size * 0.22, fill=CREAM)
        sun = size * 0.36

    c = size / 2
    d.ellipse([c - sun, c - sun, c + sun, c + sun], fill=RED)  # el sol del hinomaru

    font = ImageFont.truetype(FONT, int(sun * 1.05))
    d.text((c, c), "日", font=font, fill="white", anchor="mm")  # mm = centrado
    return img


OUT.mkdir(exist_ok=True)
for name, size, maskable in [
    ("icon-192.png", 192, False),
    ("icon-512.png", 512, False),
    ("icon-maskable-512.png", 512, True),
]:
    draw_icon(size, maskable).save(OUT / name)
    print("creado", OUT / name)
