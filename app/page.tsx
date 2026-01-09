// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AppCard = {
  name: string;
  short: string;
  url: string;
  tag: string;
  gradient: string;
  glow: string;
  accent: string;
  who: string;
  keyUses: string[];
  badge?: string; // ✅ for "Preview" / "In Development"
};

const ACCESS_EMAIL = "tcotek@amrome.com";

// ✅ IMPORTANT: make sure your file is exactly: /public/cotek-logo.png
const LOGO_SRC = "/cotek-logo.png";

const APPS: AppCard[] = [
  {
    name: "BMS",
    short: "Business Management System — sales flow, ops, delivery pulse.",
    url: "https://bms.cotek.app",
    tag: "Operations",
    gradient: "grad-bms",
    glow: "glow-bms",
    accent: "accent-bms",
    who: "Operations, Admin, Sales coordination",
    keyUses: ["Sales leads & logs", "Pipeline hygiene", "Project tracking & delivery cues"],
  },
  {
    name: "HR",
    short: "People platform — employees, leave, documents, training & goals.",
    url: "https://hr.cotek.app",
    tag: "People",
    gradient: "grad-hr",
    glow: "glow-hr",
    accent: "accent-hr",
    who: "HR, Admin, Managers",
    keyUses: ["Employee directory", "Leave workflows", "Docs, training & goals"],
  },
  {
    name: "FIN",
    short: "Finance platform — numbers, approvals, tracking, visibility.",
    url: "https://fin.cotek.app",
    tag: "Finance",
    gradient: "grad-fin",
    glow: "glow-fin",
    accent: "accent-fin",
    who: "Finance, Admin",
    keyUses: ["Tracking & approvals", "Visibility & reporting", "Operational finance"],
  },
  {
    name: "SCM",
    short: "Supply Chain & Inventory — items, assets, locations, stock events.",
    url: "https://scm.cotek.app",
    tag: "Inventory",
    gradient: "grad-scm",
    glow: "glow-scm",
    accent: "accent-scm",
    who: "Inventory team, Operations, Admin",
    keyUses: ["Items & assets", "Stock movements", "Locations, vendors, reporting"],
    badge: "Preview", // ✅ clear this is in development
  },
];

type StatusRow = {
  key: "BMS" | "HR" | "FIN" | "SCM";
  url: string;
  ok: boolean;
  status: number;
  ms: number;
};

type StatusPayload = {
  checkedAt: string;
  results: StatusRow[];
};

function Icon({ kind }: { kind: "bms" | "hr" | "fin" | "scm" }) {
  if (kind === "bms") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" className="icon">
        <path d="M7 7h10M7 12h6M7 17h10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.7"
        />
      </svg>
    );
  }
  if (kind === "hr") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" className="icon">
        <path d="M16 11a4 4 0 1 0-8 0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M4 20a8 8 0 0 1 16 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>
    );
  }
  if (kind === "fin") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" className="icon">
        <path d="M4 19V5M20 19V5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M7 16l3-3 3 2 4-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 19h16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }
  // scm
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="icon">
      <path
        d="M3 7l9-4 9 4-9 4-9-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M3 7v10l9 4 9-4V7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path d="M12 11v10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function useToast() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 1800);
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

  const [status, setStatus] = useState<Record<string, StatusRow | undefined>>({});
  const [checkedAt, setCheckedAt] = useState<string>("");

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      const data = (await res.json()) as StatusPayload;
      const map: Record<string, StatusRow> = {};
      data.results.forEach((r) => (map[r.key] = r));
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
      if (e.key === "4") window.open(APPS[3].url, "_blank", "noreferrer"); // ✅ SCM
      if (e.key.toLowerCase() === "r") fetchStatus();
      if (e.key.toLowerCase() === "h") setDrawerOpen(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openAll = () => {
    APPS.forEach((a) => window.open(a.url, "_blank", "noreferrer"));
    setMsg("Opened all apps");
  };

  const copyLinks = async () => {
    try {
      await navigator.clipboard.writeText(linksText);
      setMsg("Copied links to clipboard");
    } catch {
      setMsg("Could not copy (browser blocked)");
    }
  };

  const copyAccessEmail = async () => {
    try {
      await navigator.clipboard.writeText(ACCESS_EMAIL);
      setMsg("Copied access email");
    } catch {
      setMsg("Could not copy email (browser blocked)");
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
            {/* ✅ Replaced placeholder dot with your PNG logo */}
            <div className="logo">
              <img src={LOGO_SRC} alt="COTEK" className="logo-img" draggable={false} />
            </div>

            <div className="brand-text">
              <div className="brand-title">COTEK Portal</div>
              <div className="brand-sub">Four platforms, one launchpad — pick your orbit.</div>
            </div>
          </div>

          <div className="header-actions">
            <button className="chip" onClick={() => setDrawerOpen(true)} type="button">
              How to use
            </button>
            <a className="chip" href={`mailto:${ACCESS_EMAIL}`}>
              Need access?
            </a>
            <a className="chip chip-ghost" href="mailto:support@cotek.app">
              Support
            </a>
          </div>
        </header>

        <section className="quick fade-in">
          <button className="qbtn" onClick={openAll} type="button">
            Open all apps <span className="kbd">⇧</span>
          </button>
          <button className="qbtn qbtn-ghost" onClick={copyLinks} type="button">
            Copy links <span className="kbd">⌘</span>
          </button>
          <button className="qbtn qbtn-ghost" onClick={fetchStatus} type="button">
            Refresh status <span className="kbd">R</span>
          </button>
          <button className="qbtn qbtn-ghost" onClick={() => setDrawerOpen(true)} type="button">
            Onboarding <span className="kbd">H</span>
          </button>

          <div className="qhint">
            Shortcuts: <span className="kbd">1</span> BMS <span className="kbd">2</span> HR{" "}
            <span className="kbd">3</span> FIN <span className="kbd">4</span> SCM{" "}
            <span className="kbd">H</span> Help
          </div>
        </section>

        <section className="dash fade-in">
          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Platforms</div>
              <div className="kpi-value">4</div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Single entry point
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Role-based access inside each app
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Security</div>
              <div className="kpi-value">RBAC</div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Login required per platform
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Least-privilege by design
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

        <section className="cards cards-4">
          {APPS.map((app) => {
            const kind = app.name === "BMS" ? "bms" : app.name === "HR" ? "hr" : app.name === "FIN" ? "fin" : "scm";

            const row = status[app.name as "BMS" | "HR" | "FIN" | "SCM"];
            const st = statusLabel(row);

            return (
              <Link
                key={app.name}
                href={app.url}
                className={`app-card ${app.glow} fade-in`}
                target="_blank"
                rel="noreferrer"
              >
                <div className={`app-banner ${app.gradient}`} />
                <div className="app-body">
                  <div className="app-topline">
                    <div className={`app-icon ${app.accent}`}>
                      <Icon kind={kind} />
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
            <span>
              © {new Date().getFullYear()} COTEK • A tidy index for fast human routing.
            </span>
          </div>
          <div className="footer-right">
            <span className="footnote">If you can’t access an app, your role may not be enabled.</span>
          </div>
        </footer>
      </div>

      {/* Drawer */}
      <div className={`drawer-backdrop ${drawerOpen ? "show" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <div>
            <div className="drawer-title">Onboarding • COTEK Portal</div>
            <div className="drawer-sub">
              Different modules, same organism — the pathways stay clean so the whole system stays healthy.
            </div>
          </div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} type="button">
            ✕
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-block">
            <div className="drawer-block-title">Access</div>
            <div className="drawer-block-text">
              If you need a role enabled, email: <span className="mono">{ACCESS_EMAIL}</span>
            </div>
            <div className="drawer-actions">
              <a className="dbtn" href={`mailto:${ACCESS_EMAIL}`}>
                Email access request
              </a>
              <button className="dbtn dbtn-ghost" onClick={copyAccessEmail} type="button">
                Copy email
              </button>
            </div>
          </div>

          {APPS.map((a) => (
            <div key={a.name} className="drawer-block">
              <div className="drawer-block-title">
                {a.name} {a.badge ? <span className="dev-pill" style={{ marginLeft: 8 }}>{a.badge}</span> : null}
              </div>
              <div className="drawer-block-text">{a.short}</div>
              <div className="drawer-mini">
                <div>
                  <span className="muted">Who:</span> {a.who}
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
            <div className="drawer-block-title">Shortcuts</div>
            <div className="drawer-block-text">
              <span className="kbd">1</span> BMS • <span className="kbd">2</span> HR •{" "}
              <span className="kbd">3</span> FIN • <span className="kbd">4</span> SCM •{" "}
              <span className="kbd">R</span> Refresh • <span className="kbd">Esc</span> Close
            </div>
          </div>
        </div>
      </aside>

      {/* toast */}
      <div className={`toast ${msg ? "toast-show" : ""}`} aria-live="polite">
        {msg ?? ""}
      </div>
    </main>
  );
}
