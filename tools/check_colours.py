"""Check every palette x light/dark x colour-blind combination in style.css.

Contrast: WCAG 2.x ratios for each text/background pairing the stylesheet uses.
CVD: the four TADA letter colours (and good/bad) simulated under protanopia,
deuteranopia and tritanopia (Machado et al. 2009, severity 1), compared by
CIEDE2000.

    python3 tools/check_colours.py assets/style.css

Exits non-zero if any pairing fails. Run it after changing a colour token.
"""
import math, re, sys, itertools

css = open(sys.argv[1], encoding="utf-8").read()
css_nc = re.sub(r"/\*.*?\*/", "", css, flags=re.S)

blocks = {}
for m in re.finditer(r"(:root[^{,]*)\{([^{}]*)\}", css_nc):
    sel = re.sub(r"\s+", "", m.group(1))
    toks = dict(re.findall(r"--tada-([\w-]+)\s*:\s*(#[0-9A-Fa-f]{6})", m.group(2)))
    if toks:
        blocks.setdefault(sel, {}).update(toks)

def resolve(palette, dark, cvd):
    order = [":root"]
    if palette != "teal": order.append(f':root[data-palette="{palette}"]')
    if cvd: order.append(':root[data-cvd="on"]')
    if dark:
        order.append(':root[data-theme="dark"]')
        if palette != "teal": order.append(f':root[data-theme="dark"][data-palette="{palette}"]')
        if cvd: order.append(':root[data-theme="dark"][data-cvd="on"]')
    t = {}
    for sel in order:
        if sel not in blocks: raise SystemExit(f"missing block {sel}")
        t.update(blocks[sel])
    return t

def rgb(h): return [int(h[i:i+2], 16) / 255 for i in (1, 3, 5)]
def lin(c): return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
def unlin(c):
    c = min(max(c, 0), 1)
    return 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
def lum(h): r, g, b = map(lin, rgb(h)); return 0.2126*r + 0.7152*g + 0.0722*b
def contrast(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

MACHADO = {
    "protan": [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    "deutan": [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
    "tritan": [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
}
def simulate(h, kind):
    l = [lin(c) for c in rgb(h)]
    m = MACHADO[kind]
    return [unlin(sum(m[i][j] * l[j] for j in range(3))) for i in range(3)]

def lab(srgb):
    r, g, b = [lin(c) for c in srgb]
    x = (0.4124*r + 0.3576*g + 0.1805*b) / 0.95047
    y = (0.2126*r + 0.7152*g + 0.0722*b)
    z = (0.0193*r + 0.1192*g + 0.9505*b) / 1.08883
    f = lambda t: t ** (1/3) if t > 216/24389 else (24389/27 * t + 16) / 116
    fx, fy, fz = f(x), f(y), f(z)
    return 116*fy - 16, 500*(fx - fy), 200*(fy - fz)

def de2000(l1, l2):
    L1, a1, b1 = l1; L2, a2, b2 = l2
    C1, C2 = math.hypot(a1, b1), math.hypot(a2, b2)
    Cb = (C1 + C2) / 2
    G = 0.5 * (1 - math.sqrt(Cb**7 / (Cb**7 + 25**7)))
    a1p, a2p = (1+G)*a1, (1+G)*a2
    C1p, C2p = math.hypot(a1p, b1), math.hypot(a2p, b2)
    h1p = math.degrees(math.atan2(b1, a1p)) % 360
    h2p = math.degrees(math.atan2(b2, a2p)) % 360
    dLp, dCp = L2 - L1, C2p - C1p
    dhp = 0 if C1p*C2p == 0 else (h2p - h1p if abs(h2p - h1p) <= 180 else h2p - h1p - 360 if h2p > h1p else h2p - h1p + 360)
    dHp = 2*math.sqrt(C1p*C2p)*math.sin(math.radians(dhp/2))
    Lbp, Cbp = (L1+L2)/2, (C1p+C2p)/2
    if C1p*C2p == 0: hbp = h1p + h2p
    elif abs(h1p - h2p) <= 180: hbp = (h1p + h2p)/2
    else: hbp = (h1p + h2p + 360)/2 if h1p + h2p < 360 else (h1p + h2p - 360)/2
    T = 1 - 0.17*math.cos(math.radians(hbp-30)) + 0.24*math.cos(math.radians(2*hbp)) + 0.32*math.cos(math.radians(3*hbp+6)) - 0.20*math.cos(math.radians(4*hbp-63))
    dth = 30*math.exp(-((hbp-275)/25)**2)
    Rc = 2*math.sqrt(Cbp**7/(Cbp**7 + 25**7))
    Sl = 1 + 0.015*(Lbp-50)**2/math.sqrt(20+(Lbp-50)**2)
    Sc, Sh = 1 + 0.045*Cbp, 1 + 0.015*Cbp*T
    Rt = -math.sin(math.radians(2*dth))*Rc
    return math.sqrt((dLp/Sl)**2 + (dCp/Sc)**2 + (dHp/Sh)**2 + Rt*(dCp/Sc)*(dHp/Sh))

TEXT, LARGE = 4.5, 3.0
def pairs(t, dark):
    p = []
    for bg in ["page", "card", "surface", "surface-2", "accent-soft", "good-bg", "bad-bg",
               "warn-bg", "key-bg", "wiki-bg", "t-bg", "a1-bg", "d-bg", "a2-bg"]:
        p.append(("ink", bg, TEXT, "body text"))
    for bg in ["page", "card", "surface", "surface-2", "accent-soft", "t-bg", "a1-bg", "d-bg", "a2-bg"]:
        p.append(("ink-soft", bg, TEXT, "secondary text"))
    for bg in ["page", "card", "surface", "surface-2", "accent-soft", "good-bg", "bad-bg",
               "warn-bg", "key-bg", "wiki-bg"]:
        p.append(("accent", bg, TEXT, "link"))
    for bg in ["page", "card", "accent-soft"]:
        p.append(("accent-hover", bg, TEXT, "link hover"))
    p += [("code-ink", "surface-2", TEXT, "inline code"),
          ("good", "good-bg", TEXT, "Tip label / Yes / After"),
          ("bad", "bad-bg", TEXT, "No / Before"),
          ("warn", "warn-bg", TEXT, "Warning label"),
          ("wiki", "wiki-bg", TEXT, "Wiki Tip label"),
          ("d", "key-bg", TEXT, "Key label"),
          ("on-accent", "footer", TEXT, "footer text")]
    p.append(("page" if dark else "on-accent", "accent", TEXT, "pressed button"))
    for k in ["t", "a1", "d", "a2"]:
        p.append((k, f"{k}-bg", LARGE, "letter on its card"))
        p.append((k, "page", LARGE, "letter in chapter heading"))
    p += [("accent", "page", LARGE, "focus ring / tile border"),
          ("accent", "card", LARGE, "tile border")]
    return p

fails = 0
summary = []
for palette in ["teal", "indigo", "plum", "ember"]:
    for dark in (False, True):
        for cvd in (False, True):
            t = resolve(palette, dark, cvd)
            name = f"{palette:7s} {'dark ' if dark else 'light'} {'CVD' if cvd else '   '}"
            worst = (99, "")
            bad = []
            for fg, bg, need, what in pairs(t, dark):
                r = contrast(t[fg], t[bg])
                if r < worst[0]: worst = (r, f"{fg}/{bg}")
                if r < need:
                    bad.append(f"    FAIL {fg} {t[fg]} on {bg} {t[bg]}: {r:.2f} < {need} ({what})")
            letters = [t[k] for k in ["t", "a1", "d", "a2"]]
            cvd_min = {}
            for kind in ["normal", "protan", "deutan", "tritan"]:
                labs = [lab(rgb(c) if kind == "normal" else simulate(c, kind)) for c in letters]
                d = min(de2000(a, b) for a, b in itertools.combinations(labs, 2))
                gb = de2000(*[lab(rgb(t[k]) if kind == "normal" else simulate(t[k], kind)) for k in ("good", "bad")])
                cvd_min[kind] = (d, gb)
            if cvd:
                for kind in ["protan", "deutan", "tritan"]:
                    d, gb = cvd_min[kind]
                    if d < 15: bad.append(f"    FAIL letters too close under {kind}: dE {d:.1f} < 15")
                    if gb < 20: bad.append(f"    FAIL good/bad too close under {kind}: dE {gb:.1f} < 20")
            linkgap = contrast(t["accent"], t["ink"])
            fails += len(bad)
            cv = "  ".join(f"{k[:4]} {v[0]:4.1f}/{v[1]:4.1f}" for k, v in cvd_min.items())
            summary.append(f"{name}  worst {worst[0]:5.2f} ({worst[1]:<20s})  link/ink {linkgap:4.2f}  dE letters/goodbad: {cv}")
            summary.extend(bad)

print("\n".join(summary))
print(f"\n{fails} failure(s) across 16 combinations")
sys.exit(1 if fails else 0)
