"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  Droplets, Waves, Activity, Cpu, MapPin, AlertTriangle,
  ExternalLink, Github, Users, ChevronRight, ChevronDown,
  Radio, Shield, Zap, CloudRain, Bell, ArrowRight,
  Wifi, Server, Eye, TriangleAlert, Check, CircleDot,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type StatusType = "Normal" | "Alerta" | "Crítico";

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_LEVEL = 80;
const ALERT_THRESHOLD = 40;
const CRITICAL_THRESHOLD = 60;

const STATUS_CONFIG = {
  Normal: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    fill: "#3b82f6",
    glow: "rgba(59,130,246,0.5)",
    label: "OPERAÇÃO NORMAL",
    desc: "Nível dentro do esperado. Sistema em monitoramento passivo.",
  },
  Alerta: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    fill: "#f59e0b",
    glow: "rgba(245,158,11,0.5)",
    label: "NÍVEL DE ALERTA",
    desc: "Nível elevado. Equipes notificadas. Monitoramento intensivo.",
  },
  Crítico: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    fill: "#ef4444",
    glow: "rgba(239,68,68,0.5)",
    label: "NÍVEL CRÍTICO",
    desc: "Risco de transbordamento. Alerta máximo emitido.",
  },
} as const;

// ─── Rain Background ─────────────────────────────────────────────────────────

function RainBackground({ intensity = 20 }: { intensity?: number }) {
  const drops = Array.from({ length: intensity }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    height: `${60 + Math.random() * 80}px`,
    duration: `${1.2 + Math.random() * 0.8}s`,
    delay: `${Math.random() * 2}s`,
    opacity: 0.08 + Math.random() * 0.12,
  }));

  return (
    <div className="rain-container" aria-hidden="true">
      {drops.map((d) => (
        <div
          key={d.id}
          className="rain-drop"
          style={{
            left: d.left,
            height: d.height,
            "--duration": d.duration,
            "--delay": d.delay,
            opacity: d.opacity,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// ─── Water Fill Visualization ─────────────────────────────────────────────────

function WaterFill({
  level,
  max = MAX_LEVEL,
  status,
  height = 120,
}: {
  level: number;
  max?: number;
  status: StatusType;
  height?: number;
}) {
  const cfg = STATUS_CONFIG[status];
  const pct = Math.min((level / max) * 100, 100);
  const translateY = 100 - pct;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-white/5"
      style={{ height, background: "rgba(0,0,0,0.4)" }}
    >
      {/* Threshold markers */}
      <div
        className="absolute w-full border-t border-dashed border-amber-500/30 z-10"
        style={{ bottom: `${(ALERT_THRESHOLD / max) * 100}%` }}
      >
        <span className="absolute right-2 -top-3.5 text-[8px] font-mono text-amber-500/60 font-bold">
          ALERTA 40cm
        </span>
      </div>
      <div
        className="absolute w-full border-t border-dashed border-red-500/30 z-10"
        style={{ bottom: `${(CRITICAL_THRESHOLD / max) * 100}%` }}
      >
        <span className="absolute right-2 -top-3.5 text-[8px] font-mono text-red-500/60 font-bold">
          CRÍTICO 60cm
        </span>
      </div>

      {/* Water */}
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: "110%",
          transform: `translateY(${translateY}%)`,
          transition: "transform 0.8s cubic-bezier(0.22,1,0.36,1)",
        }}
      >
        <svg
          className="absolute -top-6 left-0 w-[300%]"
          style={{ animationName: "wave1" }}
          viewBox="0 0 600 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 12 Q75 0 150 12 Q225 24 300 12 Q375 0 450 12 Q525 24 600 12 L600 24 L0 24 Z"
            fill={cfg.fill}
            opacity="0.7"
            style={{ animation: "wave1 4s ease-in-out infinite" }}
          />
          <path
            d="M0 14 Q75 2 150 14 Q225 26 300 14 Q375 2 450 14 Q525 26 600 14 L600 24 L0 24 Z"
            fill={cfg.fill}
            opacity="0.4"
            style={{ animation: "wave2 5s ease-in-out infinite" }}
          />
        </svg>
        <div
          className="absolute inset-x-0 top-5 bottom-0"
          style={{
            background: `linear-gradient(to bottom, ${cfg.fill}cc, ${cfg.fill}44)`,
          }}
        />
      </div>

      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at bottom center, ${cfg.glow}22 0%, transparent 70%)`,
        }}
      />
    </div>
  );
}

// ─── Live Sensor Card ─────────────────────────────────────────────────────────

function SensorCard({
  level,
  status,
  history,
}: {
  level: number;
  status: StatusType;
  history: number[];
}) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div
      className={`relative rounded-[2rem] overflow-hidden border ${cfg.border} bg-gradient-to-br from-slate-950 to-black shadow-2xl transition-all duration-700`}
      style={{ boxShadow: `0 0 60px ${cfg.glow}15, inset 0 1px 0 rgba(255,255,255,0.05)` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-0">
        <div>
          <div className="flex items-center gap-2 text-slate-500 font-mono text-[9px] tracking-widest uppercase font-bold mb-1">
            <MapPin className="w-3 h-3 text-red-500" />
            PRAÇA LIONS · SOROCABA/SP
          </div>
          <div className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
            JSN-SR04T · ESP32-WROOM
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30">
            <span
              className="w-1.5 h-1.5 rounded-full bg-red-500"
              style={{ animation: "blink 1.2s ease-in-out infinite" }}
            />
            <span className="text-red-400 font-mono text-[9px] font-bold tracking-widest">LIVE</span>
          </div>
          <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-mono font-bold uppercase">
            Simulação
          </div>
        </div>
      </div>

      {/* Level number */}
      <div className="px-6 pt-4 pb-2 text-center">
        <div className="flex items-end justify-center gap-2">
          <span
            className="text-[5.5rem] font-mono font-black leading-none tracking-tighter tabular-nums"
            style={{ color: cfg.fill, textShadow: `0 0 40px ${cfg.glow}60` }}
          >
            {level.toFixed(1)}
          </span>
          <span className="text-2xl font-mono text-slate-600 mb-4 font-bold">cm</span>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest uppercase ${cfg.bg} ${cfg.color} border ${cfg.border}`}
        >
          <CircleDot className="w-2.5 h-2.5" />
          {cfg.label}
        </div>
      </div>

      {/* Water fill */}
      <div className="px-6 pb-2">
        <WaterFill level={level} status={status} height={80} />
      </div>

      {/* Mini chart */}
      <div className="px-6 pb-4">
        <div className="relative h-14 rounded-xl bg-slate-900/60 border border-white/5 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 120 40" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={cfg.fill} stopOpacity="0.4" />
                <stop offset="100%" stopColor={cfg.fill} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              fill="url(#chartGrad)"
              d={`M0 40 ${history
                .slice(-60)
                .map((v, i) => `L${(i / 59) * 120} ${40 - (v / MAX_LEVEL) * 40}`)
                .join(" ")} L120 40 Z`}
            />
            <polyline
              fill="none"
              stroke={cfg.fill}
              strokeWidth="1"
              strokeLinejoin="round"
              points={history
                .slice(-60)
                .map((v, i) => `${(i / 59) * 120},${40 - (v / MAX_LEVEL) * 40}`)
                .join(" ")}
              style={{ filter: `drop-shadow(0 0 4px ${cfg.fill})` }}
            />
          </svg>
          {/* Scan line */}
          <div
            className="absolute inset-y-0 w-6"
            style={{
              background: `linear-gradient(to right, transparent, ${cfg.fill}18, transparent)`,
              animation: "scan 6s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Footer stats */}
      <div className="grid grid-cols-3 border-t border-white/5">
        {[
          { label: "UPTIME", value: "99.8%" },
          { label: "FREQ", value: "5 Hz" },
          { label: "MAX", value: `${MAX_LEVEL}cm` },
        ].map((s) => (
          <div key={s.label} className="p-3 text-center border-r border-white/5 last:border-0">
            <div className="text-[9px] font-mono text-slate-600 tracking-widest uppercase font-bold">
              {s.label}
            </div>
            <div className="text-xs font-mono text-slate-300 font-bold mt-0.5">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function Counter({
  to,
  duration = 2000,
  prefix = "",
  suffix = "",
}: {
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = Date.now();
          const tick = () => {
            const progress = Math.min((Date.now() - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setVal(Math.round(eased * to));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{val.toLocaleString("pt-BR")}{suffix}
    </span>
  );
}

// ─── Step Card (Como Funciona) ────────────────────────────────────────────────

function StepCard({
  num,
  icon: Icon,
  title,
  desc,
  accent,
}: {
  num: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: string;
}) {
  return (
    <div className="relative group">
      <div
        className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 h-full"
        style={{ backdropFilter: "blur(8px)" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white font-mono font-black text-xs"
            style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
          >
            <span style={{ color: accent }}>{num}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${accent}15` }}
            >
              <Icon className="w-4 h-4" style={{ color: accent }} />
            </div>
            <h4 className="text-white font-bold text-sm mb-1.5 leading-snug">{title}</h4>
            <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Alert Level Card ─────────────────────────────────────────────────────────

function AlertCard({
  status,
  range,
  actions,
  active,
}: {
  status: StatusType;
  range: string;
  actions: string[];
  active: boolean;
}) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-500 overflow-hidden ${
        active ? `${cfg.border} ${cfg.bg}` : "border-white/5 bg-white/[0.02]"
      }`}
    >
      {active && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: cfg.fill }}
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-mono font-black tracking-wider uppercase ${cfg.bg} ${cfg.color} border ${cfg.border}`}
          >
            {active && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: cfg.fill, animation: "blink 1.2s ease-in-out infinite" }}
              />
            )}
            {status}
          </div>
          {active && (
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
              ATIVO AGORA
            </span>
          )}
        </div>
        <div className={`text-2xl font-mono font-black mb-1 ${cfg.color}`}>{range}</div>
        <div className="text-xs text-slate-500 font-mono mb-4">nível d&apos;água</div>
        <ul className="space-y-2">
          {actions.map((a, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
              <Check className="w-3 h-3 shrink-0 mt-0.5" style={{ color: cfg.fill }} />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [level, setLevel] = useState(14.2);
  const [status, setStatus] = useState<StatusType>("Normal");
  const [history, setHistory] = useState<number[]>(() => Array(120).fill(14.2));
  const [tick, setTick] = useState(0);

  const updateLevel = useCallback(() => {
    setLevel((prev) => {
      const t = Date.now() / 1000;
      const base = 14.2;
      const slow = Math.sin(t / 8) * 1.5;
      const mid = Math.sin(t / 3) * 0.4;
      const noise = (Math.random() - 0.5) * 0.08;
      const next = Math.max(8, Math.min(base + slow + mid + noise, MAX_LEVEL));

      const newStatus: StatusType =
        next >= CRITICAL_THRESHOLD ? "Crítico" : next >= ALERT_THRESHOLD ? "Alerta" : "Normal";
      setStatus(newStatus);
      setHistory((h) => [...h.slice(1), next]);
      setTick((t) => t + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    const id = setInterval(updateLevel, 400);
    return () => clearInterval(id);
  }, [updateLevel]);

  const members = [
    { name: "Mateus Sonnenberg Amaral", role: "Engenharia & Dev" },
    { name: "Victor Hugo Nastri Proença", role: "Hardware & IoT" },
    { name: "Samuel Barbosa de Souza", role: "Sistemas Embarcados" },
    { name: "Daniel Morone Barbosa", role: "Backend & Cloud" },
    { name: "Kaike Magalhães de Souza", role: "Frontend & UX" },
  ];

  const cfg = STATUS_CONFIG[status];

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-200 font-sans overflow-x-hidden">

      {/* ── Global grid background ── */}
      <div
        className="fixed inset-0 pointer-events-none data-grid"
        style={{ opacity: 0.6 }}
        aria-hidden="true"
      />

      {/* ── Ambient glow ── */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-[3000ms]"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 75% 20%, ${cfg.glow}08 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* ═══════════════════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 inset-x-0 z-50 h-14 border-b border-white/5"
        style={{ backdropFilter: "blur(20px)", background: "rgba(6,9,15,0.8)" }}
      >
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)" }}
            >
              <Waves className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="text-sm font-bold tracking-wide text-white">
              Smart<span className="text-blue-400">Drain</span>
            </span>
            <span className="hidden sm:inline text-[9px] font-mono text-slate-600 uppercase tracking-widest font-bold border border-slate-800 px-2 py-0.5 rounded">
              v1.0 · Protótipo
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-5 text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">
              {["Sistema", "Alertas", "Hardware", "Time"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="hover:text-blue-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-mono font-black uppercase tracking-widest transition-all duration-700 ${cfg.bg} ${cfg.color} border ${cfg.border}`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: cfg.fill, animation: "blink 1.2s ease-in-out infinite" }}
              />
              {level.toFixed(1)} cm
            </div>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col pt-14">
        <RainBackground intensity={25} />

        {/* Radial spotlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto w-full px-6 py-16 grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center">

            {/* Left – copy */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono tracking-widest uppercase font-bold">
                <Activity className="w-3 h-3 animate-pulse" />
                Projeto UPX · Facens 2026 · Sorocaba/SP
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-black text-white leading-[1] tracking-tight">
                Antes da<br />
                enchente<br />
                <span className="gradient-text-animated">chegar.</span>
              </h1>

              <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
                Smart Drain monitora o nível d&apos;água em galerias pluviais de Sorocaba
                em tempo real. Sensores IoT, alertas automáticos e prevenção antes do desastre.
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <a
                  href="#sistema"
                  className="group px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-600/25"
                >
                  Ver sistema ao vivo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
                <a
                  href="#hardware"
                  className="px-6 py-3 border border-white/10 hover:border-white/20 hover:bg-white/5 font-bold rounded-xl text-sm transition-all text-slate-300"
                >
                  Hardware specs
                </a>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-2">
                {[
                  { val: "5", unit: "Hz", label: "Amostragem" },
                  { val: "99.8", unit: "%", label: "Uptime" },
                  { val: "±1", unit: "mm", label: "Precisão" },
                  { val: "IP67", unit: "", label: "Sensor" },
                ].map((s) => (
                  <div key={s.label} className="text-center lg:text-left">
                    <div className="text-white font-mono font-black text-xl">
                      {s.val}
                      <span className="text-blue-400 text-sm ml-0.5">{s.unit}</span>
                    </div>
                    <div className="text-slate-600 text-[10px] font-mono uppercase tracking-widest font-bold">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – sensor card */}
            <div className="w-full max-w-sm mx-auto lg:max-w-none">
              <SensorCard level={level} status={status} history={history} />
            </div>
          </div>
        </div>

        <div className="flex justify-center pb-8 animate-bounce opacity-30">
          <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          IMPACT STATS
      ═══════════════════════════════════════════════════════ */}
      <section className="border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              to: 12867,
              suffix: "",
              label: "pessoas em áreas de risco",
              sub: "mapeamento Sorocaba 2024",
              color: "#ef4444",
            },
            {
              to: 148,
              suffix: "mm",
              label: "recorde de chuva em 2h",
              sub: "Janeiro de 2024",
              color: "#3b82f6",
            },
            {
              to: 230,
              suffix: "cm",
              label: "rio acima do nível normal",
              sub: "pico em Novembro/2024",
              color: "#f59e0b",
            },
            {
              to: 15,
              suffix: "min",
              label: "antecipação do alerta",
              sub: "antes do transbordamento",
              color: "#06b6d4",
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center space-y-1">
              <div
                className="text-4xl md:text-5xl font-mono font-black"
                style={{ color: stat.color }}
              >
                <Counter to={stat.to} suffix={stat.suffix} />
              </div>
              <div className="text-white text-xs font-semibold leading-snug">{stat.label}</div>
              <div className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-32 py-32">

        {/* ═══════════════════════════════════════════════════════
            COMO FUNCIONA
        ═══════════════════════════════════════════════════════ */}
        <section id="sistema">
          <div className="text-center mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono text-blue-400 uppercase tracking-[0.4em] font-black">
              <Zap className="w-3 h-3" /> Como funciona
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Do sensor ao alerta<br />
              <span className="text-slate-500">em menos de 1 segundo.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                num: "01",
                icon: Eye,
                title: "Sensor detecta nível",
                desc: "O JSN-SR04T emite pulsos ultrassônicos a 5Hz, medindo a distância até a superfície da água com precisão de ±1mm.",
                accent: "#06b6d4",
              },
              {
                num: "02",
                icon: Cpu,
                title: "ESP32 processa",
                desc: "O microcontrolador dual-core filtra o sinal, aplica médias móveis e classifica o nível em Normal, Alerta ou Crítico.",
                accent: "#3b82f6",
              },
              {
                num: "03",
                icon: Wifi,
                title: "Dados em nuvem",
                desc: "Via Wi-Fi, os dados são enviados à infraestrutura Vercel com timestamp, localização e status em tempo real.",
                accent: "#8b5cf6",
              },
              {
                num: "04",
                icon: Bell,
                title: "Alerta emitido",
                desc: "Dashboard atualizado instantaneamente. Equipes de defesa civil notificadas antes do transbordamento acontecer.",
                accent: "#f59e0b",
              },
            ].map((s) => (
              <StepCard key={s.num} {...s} />
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TELEMETRIA AO VIVO
        ═══════════════════════════════════════════════════════ */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.4em] font-black mb-2 flex items-center gap-2">
                <Radio className="w-3 h-3 animate-pulse" /> Telemetria em tempo real
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white">
                PRAÇA LIONS · Feed ao vivo
              </h2>
            </div>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${cfg.border} ${cfg.bg} transition-all duration-700`}>
              <div>
                <div className={`text-xl font-mono font-black ${cfg.color}`}>
                  {level.toFixed(1)} cm
                </div>
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  {cfg.label}
                </div>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 overflow-hidden"
            style={{ backdropFilter: "blur(8px)" }}
          >
            {/* Y axis labels */}
            <div className="relative">
              <div className="flex gap-4">
                <div className="flex flex-col justify-between text-right py-1 shrink-0 w-10">
                  {[80, 60, 40, 20, 0].map((v) => (
                    <span key={v} className="text-[8px] font-mono text-slate-700 font-bold">
                      {v}
                    </span>
                  ))}
                </div>
                <div className="flex-1 relative h-48">
                  <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="bigGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={cfg.fill} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={cfg.fill} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0, 40, 80, 120, 160].map((y) => (
                      <line
                        key={y}
                        x1="0"
                        y1={y}
                        x2="600"
                        y2={y}
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="1"
                      />
                    ))}
                    {/* Threshold lines */}
                    <line
                      x1="0"
                      y1={160 - (ALERT_THRESHOLD / MAX_LEVEL) * 160}
                      x2="600"
                      y2={160 - (ALERT_THRESHOLD / MAX_LEVEL) * 160}
                      stroke="rgba(245,158,11,0.3)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <line
                      x1="0"
                      y1={160 - (CRITICAL_THRESHOLD / MAX_LEVEL) * 160}
                      x2="600"
                      y2={160 - (CRITICAL_THRESHOLD / MAX_LEVEL) * 160}
                      stroke="rgba(239,68,68,0.3)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    {/* Fill */}
                    <path
                      fill="url(#bigGrad)"
                      d={`M0 160 ${history
                        .map(
                          (v, i) =>
                            `L${(i / (history.length - 1)) * 600} ${160 - (v / MAX_LEVEL) * 160}`
                        )
                        .join(" ")} L600 160 Z`}
                      style={{ transition: "d 0.3s ease" }}
                    />
                    {/* Line */}
                    <polyline
                      fill="none"
                      stroke={cfg.fill}
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      points={history
                        .map(
                          (v, i) =>
                            `${(i / (history.length - 1)) * 600},${
                              160 - (v / MAX_LEVEL) * 160
                            }`
                        )
                        .join(" ")}
                      style={{
                        filter: `drop-shadow(0 0 6px ${cfg.fill})`,
                        transition: "stroke 0.7s ease",
                      }}
                    />
                    {/* Current point */}
                    <circle
                      cx="600"
                      cy={160 - (level / MAX_LEVEL) * 160}
                      r="4"
                      fill={cfg.fill}
                      style={{ filter: `drop-shadow(0 0 8px ${cfg.fill})` }}
                    />
                  </svg>

                  {/* Threshold labels */}
                  <div
                    className="absolute right-2 text-[8px] font-mono text-amber-500/70 font-bold pointer-events-none"
                    style={{ bottom: `${(ALERT_THRESHOLD / MAX_LEVEL) * 100}%` }}
                  >
                    ALERTA
                  </div>
                  <div
                    className="absolute right-2 text-[8px] font-mono text-red-500/70 font-bold pointer-events-none"
                    style={{ bottom: `${(CRITICAL_THRESHOLD / MAX_LEVEL) * 100}%` }}
                  >
                    CRÍTICO
                  </div>
                </div>
              </div>

              {/* X axis */}
              <div className="flex justify-between mt-2 pl-14">
                <span className="text-[8px] font-mono text-slate-700 font-bold">−60s</span>
                <span className="text-[8px] font-mono text-slate-700 font-bold">−30s</span>
                <span className="text-[8px] font-mono text-slate-700 font-bold">agora</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                <span className="w-3 h-0.5 rounded" style={{ background: cfg.fill }} />
                Nível atual
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest font-bold">
                <span className="w-3 h-px border-t border-dashed border-amber-500/50" />
                Limiar de alerta
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600 uppercase tracking-widest font-bold">
                <span className="w-3 h-px border-t border-dashed border-red-500/50" />
                Limiar crítico
              </div>
              <span className="ml-auto text-[9px] font-mono text-amber-500/60 uppercase tracking-widest font-bold">
                * dados sintéticos — simulação ativa
              </span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            SISTEMA DE ALERTAS
        ═══════════════════════════════════════════════════════ */}
        <section id="alertas">
          <div className="mb-10">
            <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.4em] font-black mb-2 flex items-center gap-2">
              <Shield className="w-3 h-3" /> Sistema de alertas
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Três níveis de resposta.
            </h2>
            <p className="text-slate-500 mt-3 text-sm max-w-xl">
              Cada faixa de nível ativa um protocolo diferente — do monitoramento passivo ao alerta máximo para defesa civil.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <AlertCard
              status="Normal"
              range="0 – 40cm"
              active={status === "Normal"}
              actions={[
                "Monitoramento passivo contínuo",
                "Leituras a cada 200ms",
                "Dashboard atualizado em tempo real",
                "Sem notificações externas",
              ]}
            />
            <AlertCard
              status="Alerta"
              range="40 – 60cm"
              active={status === "Alerta"}
              actions={[
                "Notificação automática para equipes",
                "Frequência de leitura aumentada",
                "Registro de evento no log histórico",
                "Dashboard em modo de atenção",
              ]}
            />
            <AlertCard
              status="Crítico"
              range="60+ cm"
              active={status === "Crítico"}
              actions={[
                "Alerta máximo emitido",
                "Defesa civil notificada",
                "Sirene local ativada (planejado)",
                "Protocolo de evacuação iniciado",
              ]}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            CONTEXTO
        ═══════════════════════════════════════════════════════ */}
        <section id="sistema" className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.4em] font-black flex items-center gap-2">
              <CloudRain className="w-3 h-3" /> Contexto Regional
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Por que Sorocaba<br />
              <span className="text-slate-500">precisa disso?</span>
            </h2>
            <p className="text-slate-400 leading-relaxed text-sm font-medium">
              Em Janeiro de 2024, Sorocaba registrou seu maior volume de chuva em 40 anos: <strong className="text-blue-400">148mm em apenas 2 horas</strong>. 
              A cidade decretou Estado de Calamidade Pública após o transbordamento do Rio Sorocaba isolar bairros e atingir hospitais.
            </p>

            <div className="p-5 rounded-2xl bg-red-500/5 border-l-4 border-l-red-500 border border-red-500/10 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest">
                <TriangleAlert className="w-4 h-4" /> Ponto crítico: Praça Lions
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                A <strong className="text-white not-italic font-black">Avenida Dom Aguirre</strong>, principal via da cidade, é a primeira a ser interditada. No último grande evento, o <strong className="text-red-400 not-italic">Hospital GPACI</strong> teve o térreo inundado, exigindo a transferência emergencial de pacientes oncológicos.
              </p>
            </div>

            <p className="text-slate-400 leading-relaxed text-sm font-medium">
              O Smart Drain oferece o que a infraestrutura atual não tem: <strong className="text-blue-400 font-black">tempo de reação</strong>. Com 15 minutos de antecedência, é possível evacuar áreas críticas, proteger equipamentos médicos e fechar vias antes que veículos sejam arrastados.
            </p>
          </div>

          {/* Context visual */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute -inset-4 bg-blue-500/5 rounded-[3rem] blur-3xl" aria-hidden="true" />
            <div className="relative rounded-2xl bg-[#030609] border border-white/5 overflow-hidden shadow-2xl">
              {/* Map placeholder */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <div
                  className="absolute inset-0 data-grid opacity-40"
                  style={{ background: "#030609" }}
                />
                {/* Sorocaba city simulation */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                  {/* River */}
                  <path
                    d="M0 200 Q80 180 160 195 Q240 210 320 190 Q360 182 400 188"
                    stroke="rgba(59,130,246,0.3)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 200 Q80 180 160 195 Q240 210 320 190 Q360 182 400 188"
                    stroke="rgba(59,130,246,0.15)"
                    strokeWidth="16"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Streets grid */}
                  {[60, 120, 180, 240, 300].map((x) => (
                    <line
                      key={x}
                      x1={x}
                      y1="0"
                      x2={x}
                      y2="300"
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                    />
                  ))}
                  {[60, 120, 160, 220, 260].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={y}
                      x2="400"
                      y2={y}
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Dom Aguirre highlight */}
                  <line
                    x1="0"
                    y1="160"
                    x2="400"
                    y2="160"
                    stroke="rgba(239,68,68,0.4)"
                    strokeWidth="3"
                    strokeDasharray="8 4"
                  />
                  {/* Sensor location */}
                  <circle cx="200" cy="178" r="6" fill="rgba(37,99,235,0.8)" />
                  <circle
                    cx="200"
                    cy="178"
                    r="14"
                    fill="none"
                    stroke="rgba(37,99,235,0.4)"
                    strokeWidth="2"
                    style={{ animation: "pulseRing 2s ease-out infinite" }}
                  />
                  <circle
                    cx="200"
                    cy="178"
                    r="22"
                    fill="none"
                    stroke="rgba(37,99,235,0.2)"
                    strokeWidth="1"
                    style={{ animation: "pulseRing 2s ease-out 0.4s infinite" }}
                  />
                </svg>
                {/* Labels */}
                <div className="absolute top-3 left-3 text-[9px] font-mono text-blue-400/70 font-bold uppercase tracking-widest">
                  Sorocaba · SP
                </div>
                <div
                  className="absolute font-mono text-[8px] text-red-400/80 font-bold uppercase"
                  style={{ top: "48%", left: "4px" }}
                >
                  Av. Dom Aguirre →
                </div>
                <div
                  className="absolute font-mono text-[8px] text-blue-400/80 font-bold uppercase"
                  style={{ top: "62%", left: "36%" }}
                >
                  Rio Sorocaba
                </div>
                <div
                  className="absolute px-2 py-1 rounded bg-blue-600/20 border border-blue-500/30 text-[8px] font-mono text-blue-300 font-bold uppercase"
                  style={{ top: "56%", left: "44%" }}
                >
                  PRAÇA LIONS 📍
                </div>
              </div>
              <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest font-bold">
                  Visualização esquemática
                </span>
                <span className="text-[9px] font-mono text-blue-400/60 uppercase tracking-widest font-bold">
                  Ponto crítico · Praça Lions
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            HARDWARE
        ═══════════════════════════════════════════════════════ */}
        <section id="hardware">
          <div className="mb-10">
            <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.4em] font-black mb-2 flex items-center gap-2">
              <Cpu className="w-3 h-3" /> Stack de Hardware
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Engenharia que resiste<br />
              <span className="text-slate-500">às condições de uma galeria.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Cpu,
                color: "#3b82f6",
                tag: "Processamento",
                title: "ESP32-WROOM-32",
                specs: [
                  "Dual-core Xtensa LX6 · 240MHz",
                  "Wi-Fi 802.11b/g/n integrado",
                  "520 KB SRAM · 4 MB Flash",
                  "Consumo: ~240mA ativo",
                  "Range: até 150m (linha de vista)",
                ],
              },
              {
                icon: Droplets,
                color: "#06b6d4",
                tag: "Sensoriamento",
                title: "JSN-SR04T · Ultrassônico",
                specs: [
                  "Transdutor IP67 — à prova d'água",
                  "Frequência: 40kHz",
                  "Range: 20cm – 450cm",
                  "Precisão: ±1mm",
                  "Operação: 3.3V – 5V",
                ],
              },
              {
                icon: Server,
                color: "#8b5cf6",
                tag: "Cloud & Dashboard",
                title: "Next.js + Vercel",
                specs: [
                  "Edge functions serverless",
                  "Deploy automático via GitHub",
                  "Dashboard React 19 + Tailwind v4",
                  "Latência média: <50ms",
                  "Uptime SLA: 99.99%",
                ],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
                  >
                    <card.icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <div>
                    <div
                      className="text-[9px] font-mono uppercase tracking-widest font-bold"
                      style={{ color: card.color }}
                    >
                      {card.tag}
                    </div>
                    <div className="text-white text-sm font-bold">{card.title}</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  {card.specs.map((s) => (
                    <li key={s} className="flex items-center gap-2 text-xs text-slate-500">
                      <ChevronRight
                        className="w-3 h-3 shrink-0"
                        style={{ color: card.color }}
                      />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Architecture diagram */}
          <div className="mt-6 p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-4">
              Fluxo de dados
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
              {[
                { label: "JSN-SR04T", sub: "sensor", color: "#06b6d4" },
                { label: "→", sub: "", color: "#334155" },
                { label: "ESP32", sub: "microcontrolador", color: "#3b82f6" },
                { label: "→", sub: "", color: "#334155" },
                { label: "Wi-Fi / MQTT", sub: "protocolo", color: "#8b5cf6" },
                { label: "→", sub: "", color: "#334155" },
                { label: "Vercel API", sub: "edge function", color: "#10b981" },
                { label: "→", sub: "", color: "#334155" },
                { label: "Dashboard", sub: "este site", color: "#f59e0b" },
              ].map((node, i) =>
                node.sub ? (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="px-3 py-2 rounded-lg border text-xs font-mono font-bold"
                      style={{
                        color: node.color,
                        borderColor: `${node.color}30`,
                        background: `${node.color}08`,
                      }}
                    >
                      {node.label}
                    </div>
                    <div
                      className="text-[8px] font-mono mt-1 uppercase tracking-widest font-bold"
                      style={{ color: node.color }}
                    >
                      {node.sub}
                    </div>
                  </div>
                ) : (
                  <span
                    key={i}
                    className="text-slate-700 font-mono font-bold text-lg hidden md:block"
                  >
                    {node.label}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════
            TIME
        ═══════════════════════════════════════════════════════ */}
        <section id="time" className="pb-8">
          <div className="mb-10">
            <div className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.4em] font-black mb-2 flex items-center gap-2">
              <Users className="w-3 h-3" /> Equipe
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Quem construiu<br />
              <span className="text-slate-500">o Smart Drain.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="grid sm:grid-cols-1 gap-3">
              {members.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/20 transition-all group cursor-default"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-blue-400 font-mono font-black text-xs">
                      {m.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-bold truncate">{m.name}</div>
                    <div className="text-slate-600 text-[10px] font-mono uppercase tracking-widest font-bold">
                      {m.role}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-400 transition-colors shrink-0" />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl border border-blue-500/15 bg-blue-500/5">
                <div className="text-[9px] font-mono text-blue-400/70 uppercase tracking-[0.3em] font-black mb-4">
                  Facens · Engenharia da Computação
                </div>
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex justify-between">
                    <span className="font-mono text-slate-600 uppercase text-[10px] tracking-widest">Semestre</span>
                    <span className="font-bold text-white">1º · 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-slate-600 uppercase text-[10px] tracking-widest">Turma</span>
                    <span className="font-bold text-white">UPX Smart Cities</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-slate-600 uppercase text-[10px] tracking-widest">Cidade</span>
                    <span className="font-bold text-white">Sorocaba, SP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono text-slate-600 uppercase text-[10px] tracking-widest">Status</span>
                    <span className="font-bold text-green-400">Em desenvolvimento</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.3em] font-black mb-4">
                  Roadmap
                </div>
                <div className="space-y-3">
                  {[
                    { done: true, label: "Dashboard web funcional" },
                    { done: true, label: "Simulação de dados em tempo real" },
                    { done: true, label: "Sistema de alertas por nível" },
                    { done: false, label: "Hardware físico (ESP32 + sensor)" },
                    { done: false, label: "Integração firmware ↔ dashboard" },
                    { done: false, label: "Instalação piloto · Praça Lions" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          item.done
                            ? "bg-green-500/20 border border-green-500/40"
                            : "bg-white/5 border border-white/10"
                        }`}
                      >
                        {item.done && <Check className="w-2.5 h-2.5 text-green-400" />}
                      </div>
                      <span
                        className={item.done ? "text-slate-300" : "text-slate-600"}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/5 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Waves className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold text-sm">
                  Smart<span className="text-blue-400">Drain</span>
                </span>
              </div>
              <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest font-bold">
                Inovação em Drenagem Urbana Inteligente · Sorocaba, SP
              </p>
              <p className="text-slate-700 text-[10px] font-mono">
                Facens · Engenharia da Computação · UPX 2026
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-slate-500 hover:text-white hover:border-white/20 transition-all"
                aria-label="Link externo"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-slate-700 text-[10px] font-mono">
                © 2026 Smart Drain · Projeto Acadêmico · Uso não comercial
              </p>
              <p className="text-slate-800 text-[9px] font-mono">
                Dados exibidos são simulados · Hardware em desenvolvimento
              </p>
            </div>
            
            <details className="group cursor-pointer">
              <summary className="text-[9px] font-mono text-slate-800 hover:text-slate-600 transition-colors list-none uppercase tracking-widest font-bold flex items-center gap-1">
                <ChevronRight className="w-2.5 h-2.5 group-open:rotate-90 transition-transform" />
                Fontes de Dados Reais
              </summary>
              <div className="mt-4 p-4 rounded-xl border border-white/5 bg-black/20 space-y-3 max-w-md">
                {[
                  {
                    title: "Recorde de Chuva (148mm em 2h)",
                    src: "Jornal Cruzeiro do Sul",
                    url: "https://www.jornalcruzeiro.com.br/sorocaba/noticias/2024/01/727830-apos-forte-chuva-prefeitura-de-sorocaba-vai-decretar-estado-de-calamidade-publica.html"
                  },
                  {
                    title: "Rio Sorocaba 2,30m acima do normal",
                    src: "G1 Sorocaba e Jundiaí",
                    url: "https://g1.globo.com/sp/sorocaba-jundiai/noticia/2024/11/08/chuva-causa-alagamentos-e-transtornos-em-sorocaba.ghtml"
                  },
                  {
                    title: "12.867 pessoas em áreas de risco",
                    src: "G1 Sorocaba (Dados Federais)",
                    url: "https://g1.globo.com/sp/sorocaba-jundiai/noticia/2024/06/07/mais-de-12-mil-pessoas-vivem-em-areas-de-risco-de-inundacoes-em-sorocaba.ghtml"
                  }
                ].map((ref, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-slate-400 font-bold">{ref.title}</span>
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-blue-500/50 hover:text-blue-500 transition-colors flex items-center gap-1">
                      {ref.src} <ExternalLink className="w-2 h-2" />
                    </a>
                  </div>
                ))}
              </div>
            </details>
          </div>
        </div>
      </footer>
    </div>
  );
}
