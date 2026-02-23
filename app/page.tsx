// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TargetKey = "POEMS" | "EXP" | "PEXP";

type AppCard = {
  key: TargetKey;
  name: string;
  short: string;
  url: string;
  tag: string;
  gradient: string;
  glow: string;
  accent: string;
  what: string;
  keyUses: string[];
  badge?: string;
};

const CONTACT_EMAIL = "tcotek@amrome.com";
const LOGO_SRC = "/cotek-logo.png";

const APPS: AppCard[] = [
  {
    key: "POEMS",
    name: "poems",
    short: "A small library of lines — draft, publish, and let language breathe.",
    url: "https://poems.cotek.live",
    tag: "Poetry",
    gradient: "grad-poems",
    glow: "glow-poems",
    accent: "accent-poems",
    what: "Words, rhythms, images",
    keyUses: ["Write & revise", "Publish collections", "Search by theme / mood"],
  },
  {
    key: "EXP",
    name: "exp",
    short: "An experiment bench — notes, ideas, prototypes, and the occasional spark.",
    url: "https://exp.cotek.live",
    tag: "Experiments",
    gradient: "grad-exp",
    glow: "glow-exp",
    accent: "accent-exp",
    what: "Public experiments & logs",
    keyUses: ["Capture hypotheses", "Track outcomes", "Keep an archive of curiosities"],
  },
  {
    key: "PEXP",
    name: "pexp",
    short: "A quieter lab notebook — private work, raw thoughts, and tender drafts.",
    url: "https://pexp.cotek.live",
    tag: "Private",
    gradient: "grad-pexp",
    glow: "glow-pexp",
    accent: "accent-pexp",
    what: "Private experiments",
    keyUses: ["Personal notes", "Unpolished drafts", "Sensitive scratch work"],
    badge: "personal",
  },
];

type StatusRow = {
  key: TargetKey;
  url: string;
  ok: boolean;
  status: number;
  ms: number;
};

type StatusPayload = {
  checkedAt: string;
  results: StatusRow[];
};

function Icon({ kind }: { kind: TargetKey }) {
  if (kind === "POEMS") {
    // feather / quill vibe
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" className="icon" aria-hidden="true">
        <path
          d="M20 4c-7.5.3-13 4.7-15.8 12.7-.3.9.7 1.7 1.5 1.2 1.9-1.1 4-1.8 6.2-2.1"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M9.6 15.8c1.1-2.4 3.5-4.7 7.6-6.8M6 20c3-3 6.8-5.2 11-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>
    );
  }

  if (kind === "EXP") {
    // beaker
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" className="icon" aria-hidden="true">
        <path
          d="M10 2v6l-5.2 9a3.2 3.2 0 0 0 2.8 4.8h8.8a3.2 3.2 0 0 0 2.8-4.8L14 8V2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M8.2 14h7.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    );
  }

  // private experiment: beaker + lock
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <path
        d="M10 2v6l-4.3 7.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M14 2v6l.9 1.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M7.7 22h5.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M15.5 13h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.85"
      />
      <path
        d="M16.5 13v-1a2 2 0 1 1 4 0v1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1900);
    return () => clearTimeout(t);
  }, [msg]);

  return { msg, setMsg };
}

function statusLabel(s?: StatusRow) {
  if (!s) return { text: "Checking…", cls: "st-wait" };
  if (s.ok) return { text: `Online • ${s.ms}ms`, cls: "st-ok" };
  if (s.status) return { text: `Degraded • ${s.status}`, cls: "st-warn" };
  return { text: "Offline", cls: "st-bad" };
}

export default function Home() {
  const { msg, setMsg } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const linksText = useMemo(() => APPS.map((a) => `${a.name}: ${a.url}`).join("\n"), []);

  const [status, setStatus] = useState<Record<TargetKey, StatusRow | undefined>>({
    POEMS: undefined,
    EXP: undefined,
    PEXP: undefined,
  });
  const [checkedAt, setCheckedAt] = useState<string>("");

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const data = (await res.json()) as StatusPayload;

      const map: Record<TargetKey, StatusRow | undefined> = {
        POEMS: undefined,
        EXP: undefined,
        PEXP: undefined,
      };

      data.results.forEach((r) => {
        map[r.key] = r;
      });

      setStatus(map);
      setCheckedAt(data.checkedAt);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);

      if (e.key === "1") window.open(APPS[0].url, "_blank", "noreferrer");
      if (e.key === "2") window.open(APPS[1].url, "_blank", "noreferrer");
      if (e.key === "3") window.open(APPS[2].url, "_blank", "noreferrer");
      if (e.key.toLowerCase() === "r") fetchStatus();
      if (e.key.toLowerCase() === "h") setDrawerOpen(true);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openAll = () => {
    APPS.forEach((a) => window.open(a.url, "_blank", "noreferrer"));
    setMsg("Opened all spaces");
  };

  const copyLinks = async () => {
    try {
      await navigator.clipboard.writeText(linksText);
      setMsg("Copied links to clipboard");
    } catch {
      setMsg("Could not copy (browser blocked)");
    }
  };

  const checkedLabel = checkedAt ? new Date(checkedAt).toLocaleString() : "—";

  return (
    <main className="page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />
      <div className="grid-overlay" />

      <div className="container">
        <header className="top fade-in">
          <div className="brand">
            <div className="logo">
              <img src={LOGO_SRC} alt="COTEK" className="logo-img" draggable={false} />
            </div>
            <div className="brand-text">
              <div className="brand-title">COTEK</div>
              <div className="brand-sub">A personal launchpad — poems, experiments, and the private in-between.</div>
            </div>
          </div>

          <div className="header-actions">
            <button className="chip" onClick={() => setDrawerOpen(true)} type="button">
              How to use
            </button>
            <button className="chip chip-ghost" onClick={copyLinks} type="button">
              Copy links
            </button>
            <a className="chip" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("hello from cotek")}`}>
              Say hi
            </a>
          </div>
        </header>

        <section className="quick fade-in">
          <button className="qbtn" onClick={openAll} type="button">
            Open all <span className="kbd">⇧</span>
          </button>
          <button className="qbtn qbtn-ghost" onClick={fetchStatus} type="button">
            Refresh status <span className="kbd">R</span>
          </button>
          <button className="qbtn qbtn-ghost" onClick={() => setDrawerOpen(true)} type="button">
            Map <span className="kbd">H</span>
          </button>

          <div className="qhint">
            Shortcuts: <span className="kbd">1</span> poems <span className="kbd">2</span> exp <span className="kbd">3</span> pexp <span className="kbd">H</span> Help
          </div>
        </section>

        <section className="dash fade-in">
          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Realms</div>
              <div className="kpi-value">3</div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Poetry shelf
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Experiment bench
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Mode</div>
              <div className="kpi-value">curious</div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Keep it lightweight
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Keep it honest
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Status</div>
              <div className="kpi-value live">
                <span className="pulse" /> Live
              </div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Checked: {checkedLabel}
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Press <span className="kbd">R</span> to refresh
              </div>
            </div>
          </div>
        </section>

        <section className="cards cards-3">
          {APPS.map((app) => {
            const row = status[app.key];
            const st = statusLabel(row);

            return (
              <Link key={app.key} href={app.url} className={`app-card ${app.glow} fade-in`} target="_blank" rel="noreferrer">
                <div className={`app-banner ${app.gradient}`} />
                <div className="app-body">
                  <div className="app-topline">
                    <div className={`app-icon ${app.accent}`}>
                      <Icon kind={app.key} />
                    </div>
                    <div className="app-pill">
                      <span className="pill-dot" /> {app.tag}
                    </div>
                  </div>

                  <div className="app-title-row">
                    <h2 className="app-title">{app.name}</h2>
                    <div className="app-right">
                      {app.badge ? <span className="dev-pill">{app.badge}</span> : null}
                      <span className="open-pill">Open</span>
                    </div>
                  </div>

                  <div className={`status-pill ${st.cls}`}>
                    <span className="st-dot" />
                    {st.text}
                  </div>

                  <p className="app-desc">{app.short}</p>

                  <div className="app-footer">
                    <div className="url">{app.url.replace("https://", "")}</div>
                    <div className="hint">Opens in new tab →</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <footer className="footer fade-in">
          <div className="footer-left">
            <span className="footer-mark" />
            <span>© {new Date().getFullYear()} COTEK • personal index, not a business dashboard.</span>
          </div>
          <div className="footer-right">
            <span className="footnote">Three tabs. One mind. Many wavelengths.</span>
          </div>
        </footer>
      </div>

      <div className={`drawer-backdrop ${drawerOpen ? "show" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <div>
            <div className="drawer-title">Map • COTEK</div>
            <div className="drawer-sub">A tiny observatory: literature on one axis, experiments on another, privacy as gravity.</div>
          </div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} type="button">
            ✕
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-block">
            <div className="drawer-block-title">Navigation</div>
            <div className="drawer-block-text">
              Open a space in a new tab. Use the keyboard when you want velocity.
            </div>
            <div className="drawer-block-text">
              <span className="kbd">1</span> poems • <span className="kbd">2</span> exp • <span className="kbd">3</span> pexp • <span className="kbd">R</span> refresh • <span className="kbd">Esc</span> close
            </div>
          </div>

          {APPS.map((a) => (
            <div key={a.key} className="drawer-block">
              <div className="drawer-block-title">
                {a.name}
                {a.badge ? (
                  <span className="dev-pill" style={{ marginLeft: 8 }}>
                    {a.badge}
                  </span>
                ) : null}
              </div>
              <div className="drawer-block-text">{a.short}</div>
              <div className="drawer-mini">
                <div>
                  <span className="muted">What:</span> {a.what}
                </div>
                <ul className="drawer-list">
                  {a.keyUses.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <a className="drawer-link" href={a.url} target="_blank" rel="noreferrer">
                Open {a.name} →
              </a>
            </div>
          ))}

          <div className="drawer-block">
            <div className="drawer-block-title">A tiny note</div>
            <div className="drawer-block-text">
              This page is just routing — like a mitochondrion for tabs: small, efficient, quietly powering the rest.
            </div>
          </div>
        </div>
      </aside>

      <div className={`toast ${msg ? "toast-show" : ""}`} aria-live="polite">
        {msg ?? ""}
      </div>
    </main>
  );
}