// app/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type TargetKey = "POEMS" | "EXP" | "PEXP";
type ViewMode = "cards" | "systems";

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
    url: "https://poems.cotek.app",
    tag: "Signal",
    gradient: "grad-poems",
    glow: "glow-poems",
    accent: "accent-poems",
    what: "Information flow (language)",
    keyUses: ["Write & revise", "Publish collections", "Search by theme / mood"],
  },
  {
    key: "EXP",
    name: "exp",
    short:
      "A personal family finance ledger — track budgets, reconcile reality, and keep the household story coherent.",
    url: "https://exp.cotek.live",
    tag: "Household Ledger",
    gradient: "grad-exp",
    glow: "glow-exp",
    accent: "accent-exp",
    what: "Household cashflow & budgeting",
    keyUses: ["Track income & expenses", "Budgets & categories", "Monthly reconciliation"],
    badge: "home",
  },
  {
    key: "PEXP",
    name: "pexp",
    short:
      "A multi-tenant ledger platform — accounts, journals, and clean books across multiple entities.",
    url: "https://pexp.cotek.live",
    tag: "Multi-Tenant",
    gradient: "grad-pexp",
    glow: "glow-pexp",
    accent: "accent-pexp",
    what: "Multi-entity accounting system",
    keyUses: ["Tenants / entities", "Accounts & journals", "Reporting foundations"],
    badge: "platform",
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

type TelemetryFetch = {
  ok: boolean;
  status: number;
  ms: number;
  data?: any;
  error?: string;
};

type TelemetryResult = {
  key: TargetKey;
  baseUrl: string;
  checks: {
    summary: TelemetryFetch;
    meta: TelemetryFetch;
  };
};

type TelemetryPayload = {
  checkedAt: string;
  results: TelemetryResult[];
};

function Icon({ kind }: { kind: TargetKey }) {
  if (kind === "POEMS") {
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
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" className="icon" aria-hidden="true">
        <path
          d="M7 3h10a2 2 0 0 1 2 2v16l-2-1-2 1-2-1-2 1-2-1-2 1V5a2 2 0 0 1 2-2Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M9 8h6M9 12h6M9 16h4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <path
        d="M7 7h10M7 12h10M7 17h10"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M5 7a1 1 0 1 0 0.001 0ZM5 12a1 1 0 1 0 0.001 0ZM5 17a1 1 0 1 0 0.001 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.9"
      />
      <path
        d="M19 7a1 1 0 1 0 0.001 0ZM19 12a1 1 0 1 0 0.001 0ZM19 17a1 1 0 1 0 0.001 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.75"
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

function telemetryChip(t?: TelemetryFetch) {
  if (!t) return { text: "Telemetry: —", cls: "t-wait" };
  if (t.status === 404 || t.error === "not_implemented") return { text: "Telemetry: none", cls: "t-none" };
  if (t.ok) return { text: `Telemetry: ok • ${t.ms}ms`, cls: "t-ok" };
  if (t.status) return { text: `Telemetry: ${t.status}`, cls: "t-warn" };
  return { text: "Telemetry: offline", cls: "t-bad" };
}

function pickEngine(meta: any): string | null {
  if (!meta || typeof meta !== "object") return null;
  return (
    meta.engineVersion ??
    meta.engine ??
    meta.ledgerEngine ??
    null
  );
}

function pickVersion(meta: any): string | null {
  if (!meta || typeof meta !== "object") return null;
  return meta.version ?? meta.buildVersion ?? meta.commit ?? null;
}

export default function Home() {
  const { msg, setMsg } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("cards");

  const linksText = useMemo(() => APPS.map((a) => `${a.name}: ${a.url}`).join("\n"), []);

  const [status, setStatus] = useState<Record<TargetKey, StatusRow | undefined>>({
    POEMS: undefined,
    EXP: undefined,
    PEXP: undefined,
  });
  const [checkedAt, setCheckedAt] = useState<string>("");

  const [telemetry, setTelemetry] = useState<Record<TargetKey, TelemetryResult | undefined>>({
    POEMS: undefined,
    EXP: undefined,
    PEXP: undefined,
  });
  const [telemetryAt, setTelemetryAt] = useState<string>("");

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

  const fetchTelemetry = async () => {
    try {
      const res = await fetch("/api/telemetry", { cache: "no-store" });
      const data = (await res.json()) as TelemetryPayload;

      const map: Record<TargetKey, TelemetryResult | undefined> = {
        POEMS: undefined,
        EXP: undefined,
        PEXP: undefined,
      };

      data.results.forEach((r) => {
        map[r.key] = r;
      });

      setTelemetry(map);
      setTelemetryAt(data.checkedAt);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchTelemetry();

    const t = setInterval(() => {
      fetchStatus();
      fetchTelemetry();
    }, 90_000);

    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);

      if (e.key === "1") window.open(APPS[0].url, "_blank", "noreferrer");
      if (e.key === "2") window.open(APPS[1].url, "_blank", "noreferrer");
      if (e.key === "3") window.open(APPS[2].url, "_blank", "noreferrer");

      if (e.key.toLowerCase() === "r") {
        fetchStatus();
        fetchTelemetry();
        setMsg("Refreshed signals");
      }

      if (e.key.toLowerCase() === "h") setDrawerOpen(true);

      if (e.key.toLowerCase() === "v") {
        setView((v) => (v === "cards" ? "systems" : "cards"));
        setMsg("Toggled view");
      }
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
  const telemetryLabel = telemetryAt ? new Date(telemetryAt).toLocaleString() : "—";

  // Architecture lab: engine mismatch detector (only if both meta endpoints exist)
  const expEngine = pickEngine(telemetry.EXP?.checks?.meta?.data);
  const pexpEngine = pickEngine(telemetry.PEXP?.checks?.meta?.data);
  const engineMismatch =
    expEngine && pexpEngine && expEngine !== pexpEngine ? `${expEngine} ≠ ${pexpEngine}` : null;

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
              <div className="brand-title">COTEK OS</div>
              <div className="brand-sub">
                Systems console — signal (poems), household ledger (exp), multi-tenant accounting (pexp).
              </div>
            </div>
          </div>

          <div className="header-actions">
            <button className="chip" onClick={() => setDrawerOpen(true)} type="button">
              How to use
            </button>
            <button className="chip chip-ghost" onClick={copyLinks} type="button">
              Copy links
            </button>
            <button
              className={`chip ${view === "systems" ? "" : "chip-ghost"}`}
              onClick={() => setView((v) => (v === "cards" ? "systems" : "cards"))}
              type="button"
            >
              View: {view === "cards" ? "Cards" : "Systems"} <span className="kbd">V</span>
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
          <button
            className="qbtn qbtn-ghost"
            onClick={() => {
              fetchStatus();
              fetchTelemetry();
              setMsg("Refreshed signals");
            }}
            type="button"
          >
            Refresh signals <span className="kbd">R</span>
          </button>
          <button className="qbtn qbtn-ghost" onClick={() => setDrawerOpen(true)} type="button">
            Map <span className="kbd">H</span>
          </button>

          <div className="qhint">
            Shortcuts: <span className="kbd">1</span> poems <span className="kbd">2</span> exp{" "}
            <span className="kbd">3</span> pexp <span className="kbd">V</span> view{" "}
            <span className="kbd">R</span> refresh
          </div>
        </section>

        <section className="dash fade-in">
          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Model</div>
              <div className="kpi-value">flows</div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Signal → Stability → Scale
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Checked: {checkedLabel}
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Telemetry</div>
              <div className="kpi-value">proxy</div>
            </div>
            <div className="dash-meta">
              <div className="meta-row">
                <span className="meta-dot" /> Updated: {telemetryLabel}
              </div>
              <div className="meta-row">
                <span className="meta-dot" /> Optional: /api/summary, /api/meta
              </div>
            </div>
          </div>

          <div className="dash-card">
            <div className="dash-kpi">
              <div className="kpi-label">Engine</div>
              <div className="kpi-value">{engineMismatch ? "drift" : "aligned"}</div>
            </div>
            <div className="dash-meta">
              {engineMismatch ? (
                <>
                  <div className="meta-row">
                    <span className="meta-dot warn" /> Mismatch: {engineMismatch}
                  </div>
                  <div className="meta-row">
                    <span className="meta-dot warn" /> Multi-tenant lab wants consistency
                  </div>
                </>
              ) : (
                <>
                  <div className="meta-row">
                    <span className="meta-dot" /> exp ↔ pexp engine signal
                  </div>
                  <div className="meta-row">
                    <span className="meta-dot" /> (shows drift only if both meta endpoints exist)
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {view === "systems" ? (
          <section className="systems fade-in">
            <div className="systems-head">
              <div>
                <div className="systems-title">Systems View</div>
                <div className="systems-sub">
                  Not three apps — three layers. Think ecosystems: energy, nutrients, and governance.
                </div>
              </div>
              <div className="systems-legend">
                <span className="legend-dot poems" /> Signal
                <span className="legend-dot exp" /> Stability
                <span className="legend-dot pexp" /> Scale
              </div>
            </div>

            <div className="arch">
              <a className="arch-node poems" href={APPS[0].url} target="_blank" rel="noreferrer">
                <div className="arch-name">poems</div>
                <div className="arch-desc">Signal generator • language & memory</div>
                <div className={`arch-pill ${statusLabel(status.POEMS).cls}`}>
                  <span className="st-dot" /> {statusLabel(status.POEMS).text}
                </div>
                <div className={`arch-tpill ${telemetryChip(telemetry.POEMS?.checks?.meta).cls}`}>
                  {telemetryChip(telemetry.POEMS?.checks?.meta).text}
                </div>
              </a>

              <div className="arch-edge">
                <div className="edge-line" />
                <div className="edge-label">translates → values</div>
              </div>

              <a className="arch-node exp" href={APPS[1].url} target="_blank" rel="noreferrer">
                <div className="arch-name">exp</div>
                <div className="arch-desc">Household stability • budgets & cashflow</div>
                <div className={`arch-pill ${statusLabel(status.EXP).cls}`}>
                  <span className="st-dot" /> {statusLabel(status.EXP).text}
                </div>
                <div className="arch-meta">
                  <div className="arch-meta-row">
                    <span className="muted">engine:</span>{" "}
                    {pickEngine(telemetry.EXP?.checks?.meta?.data) ?? "—"}
                  </div>
                  <div className="arch-meta-row">
                    <span className="muted">version:</span>{" "}
                    {pickVersion(telemetry.EXP?.checks?.meta?.data) ?? "—"}
                  </div>
                </div>
              </a>

              <div className="arch-edge">
                <div className="edge-line" />
                <div className="edge-label">generalizes → tenants</div>
              </div>

              <a className="arch-node pexp" href={APPS[2].url} target="_blank" rel="noreferrer">
                <div className="arch-name">pexp</div>
                <div className="arch-desc">Scale & governance • multi-tenant accounting</div>
                <div className={`arch-pill ${statusLabel(status.PEXP).cls}`}>
                  <span className="st-dot" /> {statusLabel(status.PEXP).text}
                </div>
                <div className="arch-meta">
                  <div className="arch-meta-row">
                    <span className="muted">engine:</span>{" "}
                    {pickEngine(telemetry.PEXP?.checks?.meta?.data) ?? "—"}
                  </div>
                  <div className="arch-meta-row">
                    <span className="muted">version:</span>{" "}
                    {pickVersion(telemetry.PEXP?.checks?.meta?.data) ?? "—"}
                  </div>
                </div>
              </a>
            </div>

            <div className="telemetry-board">
              <div className="t-title">Telemetry Board</div>
              <div className="t-sub">
                If your apps implement <span className="mono">/api/summary</span> and{" "}
                <span className="mono">/api/meta</span>, this becomes your observability membrane.
              </div>

              <div className="t-grid">
                {APPS.map((a) => {
                  const tr = telemetry[a.key];
                  const metaChip = telemetryChip(tr?.checks?.meta);
                  const sumChip = telemetryChip(tr?.checks?.summary);

                  return (
                    <div key={a.key} className="t-card">
                      <div className="t-row">
                        <div className="t-name">{a.name}</div>
                        <div className="t-url">{a.url.replace("https://", "")}</div>
                      </div>
                      <div className={`t-chip ${metaChip.cls}`}>{metaChip.text}</div>
                      <div className={`t-chip ${sumChip.cls}`}>{sumChip.text}</div>
                      <div className="t-mini">
                        <div>
                          <span className="muted">engine:</span>{" "}
                          {pickEngine(tr?.checks?.meta?.data) ?? "—"}
                        </div>
                        <div>
                          <span className="muted">version:</span>{" "}
                          {pickVersion(tr?.checks?.meta?.data) ?? "—"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : (
          <section className="cards cards-3">
            {APPS.map((app) => {
              const row = status[app.key];
              const st = statusLabel(row);
              const tmeta = telemetry[app.key]?.checks?.meta;
              const tchip = telemetryChip(tmeta);

              return (
                <Link
                  key={app.key}
                  href={app.url}
                  className={`app-card ${app.glow} fade-in`}
                  target="_blank"
                  rel="noreferrer"
                >
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

                    <div className={`tele-pill ${tchip.cls}`}>{tchip.text}</div>

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
        )}

        <footer className="footer fade-in">
          <div className="footer-left">
            <span className="footer-mark" />
            <span>© {new Date().getFullYear()} COTEK • systems-first personal console.</span>
          </div>
          <div className="footer-right">
            <span className="footnote">In every ledger: conservation laws. In every poem: measurement error.</span>
          </div>
        </footer>
      </div>

      <div className={`drawer-backdrop ${drawerOpen ? "show" : ""}`} onClick={() => setDrawerOpen(false)} />
      <aside className={`drawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="drawer-head">
          <div>
            <div className="drawer-title">Map • COTEK OS</div>
            <div className="drawer-sub">
              A lab for layers: signal → household → tenants. Add telemetry endpoints and it becomes a live instrument.
            </div>
          </div>
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} type="button">
            ✕
          </button>
        </div>

        <div className="drawer-body">
          <div className="drawer-block">
            <div className="drawer-block-title">Navigation</div>
            <div className="drawer-block-text">
              <span className="kbd">1</span> poems • <span className="kbd">2</span> exp • <span className="kbd">3</span> pexp
            </div>
            <div className="drawer-block-text">
              <span className="kbd">V</span> toggle view • <span className="kbd">R</span> refresh • <span className="kbd">Esc</span> close
            </div>
          </div>

          <div className="drawer-block">
            <div className="drawer-block-title">Telemetry contract</div>
            <div className="drawer-block-text">
              If your apps expose these endpoints, the portal will read them automatically:
            </div>
            <div className="drawer-block-text mono">GET /api/meta</div>
            <div className="drawer-block-text mono">GET /api/summary</div>
            <div className="drawer-block-text">
              Start minimal: return <span className="mono">{"{ version, engineVersion }"}</span>.
            </div>
          </div>

          {APPS.map((a) => (
            <div key={a.key} className="drawer-block">
              <div className="drawer-block-title">
                {a.name}
                {a.badge ? <span className="dev-pill" style={{ marginLeft: 8 }}>{a.badge}</span> : null}
              </div>
              <div className="drawer-block-text">{a.what}</div>
              <ul className="drawer-list">
                {a.keyUses.map((x) => <li key={x}>{x}</li>)}
              </ul>
              <a className="drawer-link" href={a.url} target="_blank" rel="noreferrer">
                Open {a.name} →
              </a>
            </div>
          ))}
        </div>
      </aside>

      <div className={`toast ${msg ? "toast-show" : ""}`} aria-live="polite">
        {msg ?? ""}
      </div>
    </main>
  );
}