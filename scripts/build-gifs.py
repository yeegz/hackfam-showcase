"""Assemble captured moment frames into looping GIFs for the README.
Usage: python3 -I build-gifs.py <framesDir> <outDir>"""
import os, sys
from PIL import Image

frames_dir, out_dir = sys.argv[1], sys.argv[2]
WIDTH = 300
CROP = {}  # every moment is shown as the full phone screen, so the four read as one set
RADIUS = 52 / 390  # the phone screen's corner radius as a share of its width

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
    pal = probe.quantize(colors=254, method=Image.Quantize.MEDIANCUT)
    # Transparent rounded corners so the phone sits cleanly on light and dark pages.
    from PIL import ImageDraw
    mask = Image.new('L', imgs[0].size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, mask.width - 1, mask.height - 1], radius=round(WIDTH * RADIUS), fill=255)
    q = []
    for im in imgs:
        f = im.quantize(palette=pal, dither=Image.Dither.NONE)
        f.paste(255, mask=Image.eval(mask, lambda v: 255 - v))
        q.append(f)
    dur_file = os.path.join(d, 'durations.json')
    if os.path.exists(dur_file):
        import json
        durations = [max(20, int(x)) for x in json.load(open(dur_file))]
    else:
        durations = [700] + [40] * (len(q) - 2) + [1600]
    out = os.path.join(out_dir, f'{name}.gif')
    q[0].save(out, save_all=True, append_images=q[1:], duration=durations, loop=0, optimize=False, disposal=1, transparency=255)
    print(name, len(q), 'frames', round(os.path.getsize(out) / 1024), 'KB')
