"use client";

import { useEffect, useState } from "react";
import { 
  Droplets, 
  Waves, 
  Activity, 
  Cpu, 
  MapPin, 
  AlertTriangle,
  ExternalLink, 
  Github,
  Users,
  ChevronRight,
  Monitor,
  ChevronDown
} from "lucide-react";

export default function Home() {
  const [level, setLevel] = useState(12);
  const [status, setStatus] = useState("Normal");
  const [history, setHistory] = useState<number[]>(Array(50).fill(12)); // Aumentei para 50 pontos para ficar mais denso

  useEffect(() => {
    const interval = setInterval(() => {
      const noise = (Math.random() - 0.5) * 0.8;
      setLevel(prev => {
        const next = Math.max(10, Math.min(prev + noise, 80));
        if (next > 60) setStatus("Crítico");
        else if (next > 40) setStatus("Alerta");
        else setStatus("Normal");
        
        setHistory(h => [...h.slice(1), next]);
        return next;
      });
    }, 200); // Atualização mais rápida (5x por segundo) para parecer "vivo"
    return () => clearInterval(interval);
  }, []);

  const members = [
    { name: "Mateus Sonnenberg Amaral" },
    { name: "Victor Hugo Nastri Proença" },
    { name: "Samuel Barbosa de Souza" },
    { name: "Daniel Morone Barbosa" },
    { name: "Kaike Magalhães de Souza" }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* --- PRIMEIRA PÁGINA --- */}
      <section className="relative h-[100dvh] flex flex-col">
        <nav className="shrink-0 h-16 border-b border-slate-800/50 backdrop-blur-md flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full flex items-center gap-3">
            <Waves className="w-5 h-5 text-blue-500" />
            <h1 className="text-sm font-bold tracking-widest text-white uppercase italic">Smart Drain <span className="text-blue-500">v1.0</span></h1>
          </div>
        </nav>

        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-7xl mx-auto w-full px-6 py-4 overflow-hidden text-center lg:text-left">
          <div className="lg:w-3/5 space-y-4 lg:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono tracking-tighter">
              <Activity className="w-3 h-3 animate-pulse" /> PROTOTYPE_01 ACTIVE
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter">
              Engenharia contra <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 italic">Enchentes Urbanas.</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Monitoramento preventivo de galerias pluviais em Sorocaba. Hardware real, dados em nuvem, segurança pública.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl text-xs hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-white/5">
                Dashboard Completo <ChevronRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 border border-slate-700 font-bold rounded-xl text-xs hover:bg-slate-800 transition-all active:scale-95">
                Hardware Specs
              </button>
            </div>
          </div>

          <aside className="lg:w-2/5 w-full max-w-sm lg:max-w-none">
            <div className="p-6 lg:p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-black border border-slate-800 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
              <div className="absolute top-0 right-0 p-4 lg:p-6 flex flex-col items-end gap-2 text-right">
                 <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/20 text-red-400 text-[9px] font-bold tracking-widest uppercase">
                   LIVE
                 </div>
                 <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-mono font-bold uppercase whitespace-nowrap">
                   Simulação de Software
                 </div>
              </div>
              <h4 className="text-slate-500 font-mono text-[10px] mb-6 flex items-center gap-2">
                <MapPin className="w-3 h-3 text-red-500" /> GALERIA_04 - SOROCABA
              </h4>
              <div className="space-y-1 mb-6 text-center">
                <span className="text-6xl lg:text-8xl font-mono font-black text-white tracking-tighter transition-all">{level.toFixed(1)}</span>
                <span className="text-xl font-mono text-slate-500 ml-2">cm</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
                 <div 
                   className={`h-full transition-all duration-700 ${status === 'Normal' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : status === 'Alerta' ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,44,44,0.5)]'}`} 
                   style={{ width: `${(level / 80) * 100}%` }}
                 />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest font-bold">
                <span className={status === 'Normal' ? 'text-blue-400' : status === 'Alerta' ? 'text-yellow-400' : 'text-red-400'}>
                  {status}
                </span>
                <span className="text-slate-500">Uptime 99.8%</span>
              </div>
            </div>
          </aside>
        </main>

        <div className="shrink-0 h-12 flex items-center justify-center animate-bounce opacity-40">
           <ChevronDown className="w-5 h-5" />
        </div>
      </section>

      {/* --- SEGUNDA PÁGINA --- */}
      <div className="max-w-7xl mx-auto px-6 space-y-32 pb-24">
        
        <section id="contexto" className="pt-20 scroll-mt-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-xs font-mono text-blue-500 uppercase tracking-[0.3em]">O Problema Real</h3>
              <h2 className="text-4xl md:text-5xl font-black text-white italic leading-tight">
                Por que o <span className="text-blue-500 underline decoration-white/10 text-nowrap">Smart Drain</span> é vital?
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                Anualmente, milhares de brasileiros sofrem com as consequências devastadoras das enchentes urbanas. O que antes eram eventos raros, tornaram-se rotina nas grandes cidades, destruindo infraestruturas e colocando vidas em risco.
              </p>
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" /> FOCO: SOROCABA/SP
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Em nossa cidade, a <strong className="text-white font-bold italic">Avenida Dom Aguirre</strong> é o exemplo mais crítico. Basta uma chuva intensa para que o nível do Rio Sorocaba suba e as galerias pluviais transbordem, paralisando a principal via da cidade e isolando bairros inteiros.
                </p>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                Escolhemos este projeto pois acreditamos que a tecnologia deve servir à segurança pública. Monitorar o bueiro é o primeiro passo para uma cidade que não apenas reage ao desastre, mas o antecipa através da <strong className="text-blue-400 font-bold italic">Engenharia</strong>.
              </p>
            </div>
            
            {/* GRÁFICO TÉCNICO DE TELEMETRIA (CORRIGIDO) */}
            <div className="relative group w-full">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-2xl"></div>
              <div className="relative aspect-video rounded-[2rem] bg-slate-950 border border-slate-800 overflow-hidden flex flex-col p-4 md:p-6 shadow-2xl ring-1 ring-white/5">
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Telemetria em Tempo Real</p>
                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">Sensor: JSN-SR04T | Canal: 04-A | Galeria: Pluvial</p>
                  </div>
                  <div className="px-2 py-1 bg-blue-500/10 rounded border border-blue-500/20 text-blue-400 text-[8px] font-mono font-bold animate-pulse">
                    RECEIVING_DATA
                  </div>
                </div>

                {/* SVG do Gráfico - Agora preenchendo 100% */}
                <div className="relative flex-1 bg-slate-900/20 rounded-lg border border-white/5 overflow-hidden">
                   <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Grid Lines Horizontais */}
                      {[25, 50, 75].map(y => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                      ))}
                      
                      {/* Área Sombreada */}
                      <path
                        fill="url(#lineGradient)"
                        d={`M -5 100 ${history.map((val, i) => `L ${(i / (history.length - 1)) * 110 - 5} ${100 - (val / 80) * 100}`).join(' ')} L 105 100 Z`}
                        className="transition-all duration-200 opacity-30"
                      />
                      
                      {/* Linha do Gráfico */}
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={history.map((val, i) => `${(i / (history.length - 1)) * 110 - 5},${100 - (val / 80) * 100}`).join(' ')}
                        className="transition-all duration-200"
                      />
                      
                      <defs>
                        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                   </svg>
                   
                   {/* Linha de Scanline (Varredura) */}
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent w-20 h-full animate-[scan_6s_linear_infinite] pointer-events-none"></div>
                </div>

                <div className="mt-4 flex justify-between items-center font-mono text-[8px] uppercase tracking-widest">
                   <div className="flex gap-4">
                     <span className="text-slate-500">Escala: 0-80cm</span>
                     <span className="text-blue-400/80">Buffer: 50pts</span>
                   </div>
                   <div className="text-white font-bold bg-white/5 px-2 py-0.5 rounded">
                     {level.toFixed(1)} cm
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tech" className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-24">
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-blue-500/30 transition-all">
            <Cpu className="w-10 h-10 text-blue-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2 italic tracking-tight uppercase">ESP32 & IOT</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Processamento em C++ para máxima eficiência. Conectividade Wi-Fi e baixo consumo energético para instalação em campo.
            </p>
          </div>
          <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-cyan-500/30 transition-all">
            <Droplets className="w-10 h-10 text-cyan-500 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2 italic tracking-tight uppercase">Sensor Ultrassônico</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              O sensor JSN-SR04T com proteção IP67 permite leituras precisas mesmo em condições de alta umidade e sujeira.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-8">
             <h3 className="text-3xl font-bold italic flex items-center gap-3 tracking-tighter uppercase">
               <Users className="w-6 h-6 text-blue-500" /> Grupo UPX
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {members.map((m, i) => (
                  <div key={i} className="px-5 py-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl text-sm font-semibold flex items-center gap-3 hover:bg-slate-800 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" /> {m.name}
                  </div>
                ))}
             </div>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 self-start">
            <h4 className="text-blue-400 font-black text-xs mb-4 flex items-center gap-2 uppercase italic tracking-[0.2em]">
              <Monitor className="w-4 h-4" /> Facens Smart Cities
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase">
              Engenharia da Computação - 1º Semestre. <br/>
              Sorocaba, 2026.
            </p>
          </div>
        </section>

        <footer className="pt-12 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 opacity-50">
          <p className="text-[10px] font-mono uppercase tracking-widest italic">Smart Drain Project // 2026</p>
          <div className="flex gap-6">
            <Github className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
            <ExternalLink className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          </div>
        </footer>
      </div>
    </div>
  );
}
