/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

// Resource resolver — uses window.__resources (blob URLs) when present (standalone bundle),
// otherwise returns the original path.
const R = (path) => {
  if (!path) return path;
  const map = (typeof window !== "undefined" && window.__resources) || null;
  if (!map) return path;
  const key = path.replace(/^assets\//, "").replace(/\.[^.]+$/, "");
  return map[key] || path;
};

// =========================
// Icons (inline SVG)
// =========================
const Icon = {
  Pin: (props) => (
    <svg viewBox="0 0 24 32" fill="none" {...props}>
      <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20c0-6.6-5.4-12-12-12z" fill="currentColor"/>
      <circle cx="12" cy="12" r="4.5" fill="white"/>
    </svg>
  ),
  Map: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
    </svg>
  ),
  Search: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Heart: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  ),
  Route: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15"/><circle cx="18" cy="5" r="3"/>
    </svg>
  ),
  Camera: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Globe: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  ),
  Plus: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Star: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  ArrowRight: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  GooglePlay: (props) => (
    <svg viewBox="0 0 24 24" {...props}>
      <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.609-.92V2.734a1 1 0 01.609-.92z" fill="#34A853"/>
      <path d="M16.81 8.99L6.054 2.7l9.18 9.181 1.576-1.576a1 1 0 000-1.315z" fill="#FBBC04"/>
      <path d="M16.81 15.01l-1.576-1.575L6.054 22.62l10.756-6.295a1 1 0 000-1.315z" fill="#EA4335"/>
      <path d="M13.792 12L3.609 22.186a1 1 0 00.95.13L16.81 15.01 13.792 12z" fill="#4285F4"/>
    </svg>
  ),
  Apple: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.05 12.04c-.04-3.16 2.58-4.69 2.7-4.76-1.47-2.15-3.76-2.45-4.58-2.48-1.95-.2-3.81 1.15-4.8 1.15-.99 0-2.52-1.12-4.14-1.09-2.13.03-4.1 1.24-5.2 3.15-2.22 3.85-.57 9.55 1.59 12.68 1.06 1.53 2.32 3.25 3.97 3.19 1.6-.06 2.2-1.03 4.13-1.03 1.93 0 2.47 1.03 4.15 1 1.71-.03 2.79-1.56 3.83-3.1 1.21-1.78 1.71-3.51 1.74-3.6-.04-.02-3.34-1.28-3.37-5.11zM13.83 3.16c.88-1.07 1.47-2.55 1.31-4.03-1.27.05-2.81.85-3.71 1.91-.81.94-1.52 2.45-1.33 3.9 1.41.11 2.86-.71 3.73-1.78z"/>
    </svg>
  ),
  X: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  Mail: (props) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/>
    </svg>
  ),
};

// =========================
// Hero Map Illustration
// =========================
function HeroMap() {
  return (
    <div className="hero-collage">
      <div className="hero-iso">
        <img src={R("assets/hero_iso_map.webp")} alt="Isometric map illustration" />
      </div>

      <div className="map-chip">
        <Icon.Search width="12" height="12" />
        アニメで絞り込む
      </div>

      <div className="map-callout">
        <div className="map-callout__head">
          <span className="dot" />
          NOW TRENDING
        </div>
        <div className="map-callout__body">
          <b>聖地スポット 約1,000件</b>
          <small>全国 / 47都道府県</small>
        </div>
      </div>
    </div>
  );
}

// =========================
// Nav
// =========================
function Nav({ lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`nav ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nav-inner">
        <a href="#" className="nav-brand">
          <img src={R("assets/logo.webp")} alt="SeichiMaps logo" />
          <span><b>Seichi</b><i>Maps</i></span>
        </a>
        <div className="nav-links">
          <a href="#features">{t.nav.features}</a>
          <a href="#forwho">{t.nav.forwho}</a>
          <a href="#voices">{t.nav.voices}</a>
          <a href="#news">{t.nav.news}</a>
          <a href="#faq">{t.nav.faq}</a>
        </div>
        <div className="nav-right">
          <div className="lang-toggle">
            <button className={lang === "ja" ? "active" : ""} onClick={() => setLang("ja")}>JA</button>
            <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// =========================
// Hero
// =========================
function Hero({ t }) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg">
        <div className="grid-lines" />
        <div className="floating-pin" style={{ top: "15%", left: "8%", animationDelay: "0s", color: "var(--c-primary)" }}><Icon.Pin /></div>
        <div className="floating-pin" style={{ top: "70%", left: "5%", animationDelay: "1.5s", color: "var(--c-primary-deep)" }}><Icon.Pin /></div>
        <div className="floating-pin" style={{ top: "30%", right: "4%", animationDelay: "2.5s", color: "var(--c-primary)" }}><Icon.Pin /></div>
        <div className="floating-pin" style={{ top: "78%", right: "10%", animationDelay: "0.7s", color: "var(--c-accent)" }}><Icon.Pin /></div>
      </div>
      <div className="container">
        <div className="hero-grid">
          <div>
            <span className="eyebrow"><span className="dot" />{t.hero.eyebrow}</span>
            <h1>
              {t.hero.titleA}<br />
              <span className="accent">{t.hero.titleB}</span>
            </h1>
            <p className="hero-lede">{t.hero.lede}</p>
            <div className="hero-ctas" id="download">
              <a className="btn-gplay" href="https://play.google.com/store/apps/details?id=com.seichimaps.app" target="_blank" rel="noopener noreferrer">
                <Icon.GooglePlay className="gp-icon" />
                <span className="gp-label">
                  <small>{t.hero.googlePlay}</small>
                  <strong>{t.hero.googlePlayBig}</strong>
                </span>
              </a>
              <a className="btn-ios" href="https://apps.apple.com/us/app/seichimaps/id6783220882" target="_blank" rel="noopener noreferrer">
                <Icon.Apple className="gp-icon" />
                <span className="gp-label">
                  <small>{t.hero.ios}</small>
                  <strong>{t.hero.iosBig}</strong>
                </span>
              </a>
            </div>
            <div className="hero-meta">
              <div className="meta-item"><small>{t.hero.statsSpots}</small><b>{t.hero.countSpots}</b></div>
              <div className="meta-item"><small>{t.hero.statsAnime}</small><b>{t.hero.countAnime}</b></div>
              <div className="meta-item"><small>{t.hero.statsPref}</small><b>{t.hero.countPref}</b></div>
            </div>
          </div>
          <HeroMap />
        </div>
      </div>
    </section>
  );
}

// =========================
// Marquee strip
// =========================
function Marquee({ items }) {
  const list = [...items, ...items];
  return (
    <div className="marquee-strip">
      <div className="marquee">
        {list.map((it, i) => <span key={i}>{it}</span>)}
      </div>
    </div>
  );
}

// =========================
// Photo Compare visual (feature 05 — no screenshot available)
// =========================
function ComparePreview() {
  return (
    <div className="compare-stage">
      <div className="decor-pin" style={{top:"10%",left:"8%",color:"var(--c-primary)",opacity:0.22}}><Icon.Pin width="36" height="46"/></div>
      <div className="decor-pin" style={{bottom:"12%",right:"6%",color:"var(--c-primary-deep)",opacity:0.16}}><Icon.Pin width="28" height="36"/></div>

      <div className="compare-card compare-card--anime">
        <div className="compare-card__label">
          <span className="lbl-dot" style={{background:"var(--c-primary)"}} />
          ANIME
        </div>
        <svg viewBox="0 0 200 130" className="compare-card__art" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cmp-sky-a" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#cee5f7"/>
              <stop offset="100%" stopColor="#f5d8c4"/>
            </linearGradient>
          </defs>
          <rect width="200" height="130" fill="url(#cmp-sky-a)"/>
          <path d="M0,82 L40,68 L80,76 L120,60 L160,72 L200,64 L200,130 L0,130 Z" fill="#6b8aa8" opacity="0.55"/>
          <path d="M0,98 L50,88 L100,94 L150,85 L200,92 L200,130 L0,130 Z" fill="#3d5a78"/>
          <circle cx="155" cy="40" r="14" fill="#fff3d0" opacity="0.85"/>
        </svg>
      </div>

      <div className="compare-card compare-card--real">
        <div className="compare-card__label">
          <span className="lbl-dot" style={{background:"var(--c-accent)"}} />
          REAL
        </div>
        <svg viewBox="0 0 200 130" className="compare-card__art" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cmp-sky-b" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#d4ddea"/>
              <stop offset="100%" stopColor="#e8d4bd"/>
            </linearGradient>
          </defs>
          <rect width="200" height="130" fill="url(#cmp-sky-b)"/>
          <path d="M0,84 L40,72 L80,78 L120,64 L160,74 L200,68 L200,130 L0,130 Z" fill="#7d96b0" opacity="0.6"/>
          <path d="M0,100 L50,90 L100,96 L150,87 L200,94 L200,130 L0,130 Z" fill="#4c6481"/>
          <circle cx="155" cy="42" r="14" fill="#fdebc4" opacity="0.7"/>
        </svg>
      </div>

      <div className="compare-meta">
        <div>
          <span className="compare-meta__num">2026<small>.04</small></span>
          <span className="compare-meta__label">撮影</span>
        </div>
      </div>
    </div>
  );
}

// =========================
// Features
// =========================
function Features({ t, enabled }) {
  if (!enabled) return null;
  return (
    <section className="section" id="features">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot" />{t.features.head.eyebrow}</span>
          <h2>{t.features.head.title}</h2>
          <p>{t.features.head.lede}</p>
        </div>
        <div className="features-list">
          {t.features.items.map((f, i) => (
            <div className={`feature-row ${i % 2 ? "reverse" : ""}`} key={i}>
              <div className="reveal">
                <div className="feature-num">{f.num}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <div className="feature-tags">
                  {f.tags.map((tag, j) => <span className="feature-tag" key={j}>{tag}</span>)}
                </div>
              </div>
              <div className="reveal" data-delay="1">
                {i === 4 ? (
                  <ComparePreview />
                ) : (
                  <div className="phone-stage">
                    <div className="decor-pin" style={{top:"12%",left:"10%",color:"var(--c-primary)",opacity:0.25}}><Icon.Pin width="36" height="46"/></div>
                    <div className="decor-pin" style={{bottom:"15%",right:"8%",color:"var(--c-primary-deep)",opacity:0.18}}><Icon.Pin width="28" height="36"/></div>
                    <div className={`phone-mock ${i % 2 ? "tilt-right" : "tilt-left"}`}>
                      <img src={R(f.img)} alt={f.title} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================
// For Who
// =========================
function ForWho({ t, enabled }) {
  if (!enabled) return null;
  return (
    <section className="section for-who-section" id="forwho">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot" />{t.forwho.head.eyebrow}</span>
          <h2>{t.forwho.head.title}</h2>
        </div>
        <div className="for-who-grid">
          {t.forwho.items.map((it, i) => (
            <div className="for-who-card reveal" data-delay={String((i % 3) + 1)} key={i}>
              <span className="num">0{i + 1}</span>
              <div className="glyph" style={{ fontSize: 22 }}>{it.glyph}</div>
              <h4>{it.title}</h4>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================
// Voices
// =========================
function Voices({ t, enabled }) {
  if (!enabled) return null;
  return (
    <section className="section" id="voices">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot" />{t.voices.head.eyebrow}</span>
          <h2>{t.voices.head.title}</h2>
          <p>{t.voices.head.lede}</p>
        </div>
        <div className="voices-grid">
          {t.voices.items.map((v, i) => (
            <div className="voice-card reveal" data-delay={String(i + 1)} key={i}>
              <div className="voice-stars">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Icon.Star width="14" height="14" key={j} style={{ opacity: j < v.stars ? 1 : 0.2 }} />
                ))}
              </div>
              <blockquote>{v.body}</blockquote>
              <div className="voice-author">
                <div className="voice-avatar">{v.name.slice(0, 1)}</div>
                <div className="meta">
                  <b>{v.name}</b>
                  <small>{v.meta}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================
// News
// =========================
function News({ t, enabled }) {
  if (!enabled) return null;
  return (
    <section className="section news-section" id="news">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot" />{t.news.head.eyebrow}</span>
          <h2>{t.news.head.title}</h2>
        </div>
        <div className="news-grid">
          {t.news.items.map((n, i) => (
            <a className={`news-card reveal tag-${n.tag.toLowerCase()}`} data-delay={String(i + 1)} key={i} href="#">
              <div className="date">{n.date}</div>
              <span className="tag">{n.tagLabel}</span>
              <h4>{n.title}</h4>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================
// iOS coming
// =========================
function IosComing({ t, enabled }) {
  if (!enabled) return null;
  return (
    <section className="ios-section" id="ios">
      <div className="container">
        <div className="ios-card reveal">
          <div>
            <div className="ios-eyebrow">● {t.ios.eyebrow}</div>
            <h3>{t.ios.title}</h3>
            <p>{t.ios.desc}</p>
            <a className="btn-ios" href="https://apps.apple.com/us/app/seichimaps/id6783220882" target="_blank" rel="noopener noreferrer" style={{marginTop:"24px"}}>
              <Icon.Apple className="gp-icon" />
              <span className="gp-label">
                <small>{t.hero.ios}</small>
                <strong>{t.hero.iosBig}</strong>
              </span>
            </a>
          </div>
          <div className="ios-illust">
            <div className="ios-glow" />
            <div className="iphone-frame">
              <svg viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="10" width="180" height="380" rx="32" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                <rect x="20" y="20" width="160" height="360" rx="24" fill="rgba(255,255,255,0.04)"/>
                <rect x="78" y="22" width="44" height="14" rx="7" fill="rgba(255,255,255,0.15)"/>
                <g transform="translate(70 150)">
                  <path d="M30 0C13.4 0 0 13.4 0 30c0 22.5 30 50 30 50s30-27.5 30-50C60 13.4 46.6 0 30 0z" fill="rgba(74,158,234,0.6)"/>
                  <circle cx="30" cy="30" r="11" fill="rgba(255,255,255,0.9)"/>
                  <text x="30" y="35" textAnchor="middle" fontSize="14" fontWeight="700" fill="#1d6fc0">S</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// =========================
// FAQ
// =========================
function Faq({ t, enabled }) {
  if (!enabled) return null;
  const [openIdx, setOpenIdx] = useState(0);
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow"><span className="dot" />{t.faq.head.eyebrow}</span>
          <h2>{t.faq.head.title}</h2>
        </div>
        <div className="faq-list">
          {t.faq.items.map((it, i) => (
            <div className={`faq-item ${openIdx === i ? "open" : ""}`} key={i}>
              <button className="faq-q" onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
                <span style={{display:"flex",alignItems:"center",flex:1}}>
                  <span className="q-mark">Q{String(i + 1).padStart(2, "0")}</span>
                  {it.q}
                </span>
                <span className="faq-icon"><Icon.Plus width="12" height="12"/></span>
              </button>
              <div className="faq-a" style={{ maxHeight: openIdx === i ? "300px" : "0" }}>
                <div className="faq-a-inner">{it.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// =========================
// Final CTA
// =========================
function FinalCta({ t }) {
  return (
    <section className="final-cta" id="cta">
      <div className="container">
        <h2 className="reveal">{t.finalCta.title}</h2>
        <p className="reveal" data-delay="1">{t.finalCta.lede}</p>
        <div className="hero-ctas reveal" data-delay="2">
          <a className="btn-gplay" href="https://play.google.com/store/apps/details?id=com.seichimaps.app" target="_blank" rel="noopener noreferrer">
            <Icon.GooglePlay className="gp-icon" />
            <span className="gp-label">
              <small>{t.hero.googlePlay}</small>
              <strong>{t.hero.googlePlayBig}</strong>
            </span>
          </a>
          <a className="btn-ios" href="https://apps.apple.com/us/app/seichimaps/id6783220882" target="_blank" rel="noopener noreferrer">
            <Icon.Apple className="gp-icon" />
            <span className="gp-label">
              <small>{t.hero.ios}</small>
              <strong>{t.hero.iosBig}</strong>
            </span>
          </a>
        </div>
        <p style={{ fontSize: 12, color: "var(--c-ink-3)", maxWidth: 620, margin: "40px auto 0", lineHeight: 1.7 }} className="reveal" data-delay="3">
          {t.finalCta.note}
        </p>
      </div>
    </section>
  );
}

// =========================
// Footer
// =========================
function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <img src={R("assets/logo.webp")} alt="SeichiMaps" />
              <b>Seichi<i>Maps</i></b>
            </div>
            <p className="footer-tag">{t.footer.tag}</p>
          </div>
          <div className="footer-col">
            <h5>{t.footer.product}</h5>
            <ul>{t.footer.productLinks.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h5>{t.footer.support}</h5>
            <ul>{t.footer.supportLinks.map((l, i) => <li key={i}><a href="#">{l}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h5>{t.footer.legal}</h5>
            <ul>{t.footer.legalLinks.map((l, i) => <li key={i}><a href={l.url} target="_blank" rel="noreferrer">{l.label}</a></li>)}</ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>{t.footer.copyright}</div>
          <div className="social-row">
            <a href="#" aria-label="X"><Icon.X width="14" height="14" /></a>
            <a href="#" aria-label="Mail"><Icon.Mail width="14" height="14" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// =========================
// App
// =========================
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "warm",
  "font": "default",
  "showFeatures": true,
  "showForWho": true,
  "showVoices": true,
  "showNews": true,
  "showIos": true,
  "showFaq": true
}/*EDITMODE-END*/;

function App() {
  const [lang, setLang] = useState("ja");
  const [tw] = useState(TWEAK_DEFAULTS);
  const t = window.SM_I18N[lang];

  // Apply theme + font to root
  useEffect(() => {
    const html = document.documentElement;
    if (tw.theme === "dark") html.setAttribute("data-theme", "dark");
    else if (tw.theme === "light") html.setAttribute("data-theme", "light");
    else html.removeAttribute("data-theme");
    html.setAttribute("data-font", tw.font);
  }, [tw.theme, tw.font]);

  // Reveal observer
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [lang, tw.showFeatures, tw.showForWho, tw.showVoices, tw.showNews, tw.showIos, tw.showFaq]);

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      <Hero t={t} />
      <Marquee items={t.marquee} />
      <Features t={t} enabled={tw.showFeatures} />
      <ForWho t={t} enabled={tw.showForWho} />
      <Voices t={t} enabled={tw.showVoices} />
      <News t={t} enabled={tw.showNews} />
      <IosComing t={t} enabled={tw.showIos} />
      <Faq t={t} enabled={tw.showFaq} />
      <FinalCta t={t} />
      <Footer t={t} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
