"""Compose the showcase images from prototype screenshots.
Usage: python3 -I compose.py <shotsDir> <fontPath> <outDir> [name]
Writes hero-{dark,light}.png, how-it-works-{dark,light}.png and devices-{dark,light}.png."""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

shots, font_path, out = sys.argv[1], sys.argv[2], sys.argv[3]
NAME = sys.argv[4] if len(sys.argv) > 4 else 'Hackfam'

THEME = {
    'dark': {'bg': (11, 12, 15), 'ink': (241, 243, 246), 'ink2': (163, 172, 185), 'line': (34, 37, 43)},
    'light': {'bg': (245, 246, 248), 'ink': (17, 20, 25), 'ink2': (84, 93, 107), 'line': (225, 228, 233)},
}


def font(size, width=100, weight=600):
    f = ImageFont.truetype(font_path, size)
    f.set_variation_by_axes([width, weight, 0])
    return f


def shot(name, theme):
    return Image.open(os.path.join(shots, f'{name}-{theme}.png')).convert('RGBA')


def rounded(im, radius):
    mask = Image.new('L', im.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, im.width - 1, im.height - 1], radius=radius, fill=255)
    out_im = im.copy()
    out_im.putalpha(mask)
    return out_im


def phone(name, theme, height):
    im = shot(name, theme)
    w = round(im.width * height / im.height)
    im = im.resize((w, height), Image.LANCZOS)
    return rounded(im, round(52 * height / 844))


def wrap(d, text, f, width):
    words, lines, cur = text.split(), [], ''
    for w in words:
        trial = (cur + ' ' + w).strip()
        if d.textlength(trial, font=f) <= width:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    lines.append(cur)
    return lines


def hero(theme):
    t = THEME[theme]
    W, H = 2400, 1260
    c = Image.new('RGBA', (W, H), t['bg'] + (255,))
    d = ImageDraw.Draw(c)
    col = 820
    d.text((130, 380), NAME, font=font(176, 112, 760), fill=t['ink'])
    f = font(50, 100, 520)
    y = 600
    for para in ('Teammates for hackathons, CTFs and game jams.', 'Pick an event. Fill the roles your team is missing.'):
        for line in wrap(d, para, f, col):
            d.text((136, y), line, font=f, fill=t['ink2'])
            y += 66
        y += 28
    d.text((136, 1120), 'Design prototype. Not yet released.', font=font(30, 100, 480), fill=t['ink2'])
    ph = 940
    pw = round(390 * ph / 844)
    xs = [1010, 1010 + pw - 30, 1010 + 2 * (pw - 30)]
    order = [0, 2, 1]  # middle phone drawn last, on top
    names = ['discover', 'discover-match', 'team-full']
    for i in order:
        p = phone(names[i], theme, ph)
        y0 = (H - ph) // 2 + (0 if i == 1 else 40)
        c.alpha_composite(p, (xs[i], y0))
    return c.convert('RGB')


def strip(theme):
    t = THEME[theme]
    steps = [
        ('onboarding-build', 'What you build at'),
        ('events', 'Pick an event'),
        ('discover', 'Meet the pool'),
        ('discover-match', 'Both said yes'),
        ('team-full', 'Fill the slots'),
    ]
    ph, gap, pad = 900, 56, 80
    pw = round(390 * ph / 844)
    W = pad * 2 + len(steps) * pw + (len(steps) - 1) * gap
    H = pad + ph + 150
    c = Image.new('RGBA', (W, H), t['bg'] + (255,))
    d = ImageDraw.Draw(c)
    for i, (n, label) in enumerate(steps):
        x = pad + i * (pw + gap)
        c.alpha_composite(phone(n, theme, ph), (x, pad))
        d.text((x + 4, pad + ph + 34), f'{i + 1}', font=font(40, 112, 760), fill=t['ink'])
        d.text((x + 52, pad + ph + 40), label, font=font(36, 100, 600), fill=t['ink'])
    return c.convert('RGB')


def devices(theme):
    t = THEME[theme]
    desk = shot('desktop-events', theme)
    ipad = shot('ipad-discover', theme)
    W, H = 2400, 1120
    c = Image.new('RGBA', (W, H), t['bg'] + (255,))
    dw = 1460
    desk = rounded(desk.resize((dw, round(desk.height * dw / desk.width)), Image.LANCZOS), 18)
    iw = 640
    ipad = rounded(ipad.resize((iw, round(ipad.height * iw / ipad.width)), Image.LANCZOS), 34)
    c.alpha_composite(desk, (80, (H - desk.height) // 2))
    c.alpha_composite(ipad, (80 + dw + 140, (H - ipad.height) // 2))
    return c.convert('RGB')


os.makedirs(out, exist_ok=True)
for theme in ('dark', 'light'):
    for fn, make in (('hero', hero), ('how-it-works', strip), ('devices', devices)):
        im = make(theme)
        p = os.path.join(out, f'{fn}-{theme}.png')
        im.save(p, optimize=True)
        print(p, im.size, round(os.path.getsize(p) / 1024), 'KB')
