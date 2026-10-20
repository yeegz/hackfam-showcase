"""Assemble captured moment frames into looping GIFs for the README.
Usage: python3 -I build-gifs.py <framesDir> <outDir>"""
import os, sys
from PIL import Image

frames_dir, out_dir = sys.argv[1], sys.argv[2]
WIDTH = 330
CROP = {'snap': (0.58, 1.0)}  # the snap happens in the lower part of the event page

for name in sorted(os.listdir(frames_dir)):
    d = os.path.join(frames_dir, name)
    if not os.path.isdir(d):
        continue
    files = sorted(f for f in os.listdir(d) if f.endswith('.png'))
    imgs = []
    for f in files:
        im = Image.open(os.path.join(d, f)).convert('RGB')
        key = name.split('-')[0]
        if key in CROP:
            t, b = CROP[key]
            im = im.crop((0, int(im.height * t), im.width, int(im.height * b)))
        h = round(im.height * WIDTH / im.width)
        imgs.append(im.resize((WIDTH, h), Image.LANCZOS))
    # One shared palette from a mix of frames keeps colours stable between frames.
    probe = Image.new('RGB', (WIDTH, imgs[0].height * 3))
    for i, k in enumerate([0, len(imgs) // 2, len(imgs) - 1]):
        probe.paste(imgs[k], (0, i * imgs[0].height))
    pal = probe.quantize(colors=255, method=Image.Quantize.MEDIANCUT)
    q = [im.quantize(palette=pal, dither=Image.Dither.NONE) for im in imgs]
    durations = [700] + [40] * (len(q) - 2) + [1600]
    out = os.path.join(out_dir, f'{name}.gif')
    q[0].save(out, save_all=True, append_images=q[1:], duration=durations, loop=0, optimize=True, disposal=1)
    print(name, len(q), 'frames', round(os.path.getsize(out) / 1024), 'KB')
