#!/usr/bin/env python3
"""SeichiMaps 縦型ショート動画 (1080x1920, 30fps, 20s)。PIL でフレーム生成 → ffmpeg(H.264)。
Usage: python3 video/make_video.py [out.mp4]   要: fonts-noto-cjk, ffmpeg, Pillow"""
import subprocess, sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W, H, FPS, DUR = 1080, 1920, 30, 20
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'seichimaps_short.mp4')
BLUE = (0x18, 0x5F, 0xA5)
FONT = '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc'
def font(s): return ImageFont.truetype(FONT, s, index=0)  # index0 = JP

def load(n): return Image.open(os.path.join(A, n)).convert('RGBA')

def phone(name, w=500):
    im = load(name); h = round(im.height * w / im.width)
    im = im.resize((w, h), Image.LANCZOS)
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, w-1, h-1), 44, fill=255)
    pad = 60; out = Image.new('RGBA', (w+2*pad, h+2*pad), (0, 0, 0, 0))
    sh = Image.new('RGBA', out.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((pad+4, pad+24, pad+w+4, pad+h+24), 50, fill=(0, 0, 0, 120))
    out.alpha_composite(sh.filter(ImageFilter.GaussianBlur(26)))
    ImageDraw.Draw(out).rounded_rectangle((pad-12, pad-12, pad+w+12, pad+h+12), 56, fill=(20, 24, 32, 255))
    out.paste(im, (pad, pad), m)
    return out

bg = Image.new('RGB', (W, H))
d = ImageDraw.Draw(bg)
for y in range(H):
    t = y / H
    d.line((0, y, W, y), fill=tuple(int(c0 + (c1 - c0) * t) for c0, c1 in zip((0x2A, 0x7B, 0xC4), (0x0E, 0x3A, 0x6B))))

hero = load('hero_iso_map.webp'); hero = hero.resize((900, round(hero.height * 900 / hero.width)), Image.LANCZOS)
logo = load('logo.webp').resize((300, 300), Image.LANCZOS)
lm = Image.new('L', (300, 300), 0); ImageDraw.Draw(lm).rounded_rectangle((0, 0, 299, 299), 66, fill=255)
logo.putalpha(lm)

# (start, end, caption lines, kind, asset)
scenes = [
    (0, 3, ['アニメの聖地、', 'どこにある？'], 'hero', hero),
    (3, 7, ['全国のスポットを', '地図でチェック'], 'phone', phone('screen_map.webp')),
    (7, 11, ['作品名から', 'スポット検索'], 'phone', phone('screen_spots.webp')),
    (11, 15, ['巡礼ルートを', 'かんたん作成'], 'phone', phone('screen_route.webp')),
    (15, 18, ['推しキャラの', '聖地も探せる'], 'phone', phone('screen_oshi.webp')),
    (18, 20, ['SeichiMaps', '無料配信中'], 'end', logo),
]
FADE = 0.4
def ease(t): t = max(0, min(1, t)); return t*t*(3-2*t)

def text_c(im, lines, y, size, fill=(255, 255, 255), gap=14):
    f = font(size); d = ImageDraw.Draw(im)
    for ln in lines:
        w = d.textlength(ln, font=f)
        assert w <= W - 120, (ln, w)
        d.text(((W-w)/2+3, y+3), ln, font=f, fill=(0, 0, 0, 90))
        d.text(((W-w)/2, y), ln, font=f, fill=fill)
        y += size + gap

def scene_layer(i, t):
    s0, s1, cap, kind, a = scenes[i]
    p = (t - s0) / (s1 - s0)
    L = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ein = ease((t - s0) / 0.6)
    if kind == 'end':
        text_c(L, cap, 300, 96)
        L.alpha_composite(a, ((W-300)//2, 700 + int((1-ein)*40)))
        text_c(L, ['App Store / Google Play'], 1080, 58, (255, 255, 255))
        text_c(L, ['seichimaps.com'], 1190, 48, (200, 225, 250))
        return L
    text_c(L, cap, 260, 104)
    if kind == 'hero':
        sc = 0.95 + 0.1 * p
        im = a.resize((int(a.width*sc), int(a.height*sc)), Image.LANCZOS)
        L.alpha_composite(im, ((W-im.width)//2, 860 - im.height//2 + 120 + int((1-ein)*60)))
    else:
        sc = 0.94 + 0.08 * p
        im = a.resize((int(a.width*sc), int(a.height*sc)), Image.LANCZOS)
        dx = int((1-ein) * 220)
        y = 560 + (1100 - (im.height - 120)) // 2  # keep inside bottom safe area
        L.alpha_composite(im, ((W-im.width)//2 + dx, max(500, y) - 60))
    return L

def alpha_mul(L, k):
    if k >= 1: return L
    a = L.getchannel('A').point(lambda v: int(v*k)); L.putalpha(a); return L

ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
    '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-r', str(FPS), '-movflags', '+faststart', OUT], stdin=subprocess.PIPE)
for n in range(DUR * FPS):
    t = n / FPS
    fr = bg.convert('RGBA')
    for i, s in enumerate(scenes):
        a = 1.0
        if t < s[0] - 0 or t >= s[1] + FADE: continue
        if i > 0 and t < s[0] + FADE: a = (t - s[0]) / FADE
        elif i < len(scenes)-1 and t >= s[1]: a = 1 - (t - s[1]) / FADE
        if t >= s[1] and i == len(scenes)-1: continue
        fr.alpha_composite(alpha_mul(scene_layer(i, min(t, s[1])), a))
    if t < 0.0: pass
    ff.stdin.write(fr.convert('RGB').tobytes())
ff.stdin.close(); ff.wait()
