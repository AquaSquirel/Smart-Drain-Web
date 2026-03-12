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
  const [level, setLevel] = useState(12.4);
  const [status, setStatus] = useState("Normal");
  const [history, setHistory] = useState<number[]>(Array(60).fill(12.4));

  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(prev => {
        const baseLevel = 12.4;
        const slowWave = Math.sin(Date.now() / 5000) * 0.3;
        const microNoise = (Math.random() - 0.5) * 0.05;
        
        const next = Math.max(10, Math.min(baseLevel + slowWave + microNoise, 80));
        
        if (next > 60) setStatus("Crítico");
        else if (next > 40) setStatus("Alerta");
        else setStatus("Normal");
        
        setHistory(h => [...h.slice(1), next]);
        return next;
      });
    }, 500);
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono tracking-widest uppercase font-bold">
              <Activity className="w-3 h-3 animate-pulse" /> PROTOTYPE_01 ACTIVE
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight pr-4">
              Engenharia contra <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 italic font-black uppercase inline-block pb-2">Enchentes Urbanas.</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Monitoramento preventivo de galerias pluviais em Sorocaba. Hardware real, dados em nuvem, segurança pública.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl text-xs hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2 shadow-xl shadow-white/5 uppercase">
                Dashboard Completo <ChevronRight className="w-4 h-4" />
              </button>
              <button className="px-6 py-3 border border-slate-700 font-bold rounded-xl text-xs hover:bg-slate-800 transition-all active:scale-95 uppercase">
                Hardware Specs
              </button>
            </div>
          </div>

          <aside className="lg:w-2/5 w-full max-w-sm lg:max-w-none">
            <div className="p-6 lg:p-8 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-slate-800 shadow-2xl relative overflow-hidden ring-1 ring-white/10">
              <div className="absolute top-0 right-0 p-4 lg:p-6 flex flex-col items-end gap-2 text-right">
                 <div className="flex items-center gap-2 px-2 py-1 rounded bg-red-500/20 text-red-400 text-[9px] font-bold tracking-widest uppercase shadow-lg shadow-red-500/10">
                   LIVE
                 </div>
                 <div className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-mono font-bold uppercase whitespace-nowrap">
                   Simulação Ativa
                 </div>
              </div>
              <h4 className="text-slate-500 font-mono text-[10px] mb-8 flex items-center gap-2 uppercase tracking-widest font-bold">
                <MapPin className="w-3 h-3 text-red-500" /> GALERIA_04 - SOROCABA
              </h4>
              <div className="space-y-1 mb-8 text-center relative group">
                <span className="text-7xl lg:text-9xl font-mono font-black text-white tracking-tighter transition-all drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">{level.toFixed(1)}</span>
                <span className="text-2xl font-mono text-slate-600 ml-2">cm</span>
              </div>
              <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden mb-6 border border-white/5 p-0.5">
                 <div 
                   className={`h-full rounded-full transition-all duration-700 ${status === 'Normal' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : status === 'Alerta' ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.6)]' : 'bg-red-500 shadow-[0_0_15px_rgba(239,44,44,0.6)]'}`} 
                   style={{ width: `${(level / 80) * 100}%` }}
                 />
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest font-bold">
                <span className={status === 'Normal' ? 'text-blue-400' : status === 'Alerta' ? 'text-yellow-400' : 'text-red-400'}>
                  STATUS_{status}
                </span>
                <span className="text-slate-600">UPTIME // 99.8%</span>
              </div>
            </div>
          </aside>
        </main>

        <div className="shrink-0 h-12 flex items-center justify-center animate-bounce opacity-30">
           <ChevronDown className="w-5 h-5 text-white" />
        </div>
      </section>

      {/* --- SEGUNDA PÁGINA --- */}
      <div className="max-w-7xl mx-auto px-6 space-y-32">
        
        <section id="contexto" className="pt-20 scroll-mt-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-xs font-mono text-blue-500 uppercase tracking-[0.4em] font-bold">Contexto Regional</h3>
              <h2 className="text-4xl md:text-5xl font-black text-white italic leading-tight uppercase tracking-tighter">
                Por que o <span className="text-blue-500 underline decoration-white/10 italic">Smart Drain</span> é vital?
              </h2>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base font-medium">
                Anualmente, milhares de brasileiros sofrem com as consequências devastadoras das enchentes urbanas. O que antes eram eventos raros, tornaram-se rotina nas grandes cidades, destruindo infraestruturas e colocando vidas em risco.
              </p>
              <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 space-y-4 relative overflow-hidden group border-l-4 border-l-red-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-red-500/10 transition-colors"></div>
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-widest">
                  <AlertTriangle className="w-4 h-4" /> FOCO CRÍTICO: SOROCABA/SP
                </div>
                <p className="text-sm text-slate-300 leading-relaxed relative z-10 font-medium italic">
                  Em nossa cidade, a <strong className="text-white font-black italic uppercase underline decoration-red-500/50 underline-offset-4">Avenida Dom Aguirre</strong> é o exemplo mais crítico. Basta uma chuva intensa para que o nível do Rio Sorocaba suba e as galerias pluviais transbordem, paralisando a principal via da cidade e isolando bairros inteiros.
                </p>
              </div>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base font-medium">
                Escolhemos este projeto pois acreditamos que a tecnologia deve servir à segurança pública. Monitorar o bueiro é o primeiro passo para uma cidade que não apenas reage ao desastre, mas o antecipa através da <strong className="text-blue-400 font-black italic uppercase tracking-widest">Engenharia</strong>.
              </p>
            </div>
            
            {/* GRÁFICO TÉCNICO DE TELEMETRIA */}
            <div className="relative group w-full">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-[3rem] blur-2xl group-hover:bg-blue-500/15 transition-all"></div>
              <div className="relative aspect-video rounded-[2.5rem] bg-[#020617] border border-slate-800/80 overflow-hidden flex flex-col p-4 md:p-6 shadow-2xl ring-1 ring-white/5">
                
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b82f605_0%,transparent_70%)] pointer-events-none"></div>
                
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <p className="text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em] font-black italic">Telemetria de Fluxo</p>
                    <p className="text-[8px] font-mono text-slate-600 uppercase font-bold tracking-widest">Amostragem: 5Hz | Buffer: 60pts | Ref: 04-A</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-right">
                    <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[8px] font-mono font-black uppercase tracking-widest rounded shadow-lg shadow-amber-500/5">
                      Sintético: Simulação
                    </div>
                    <div className="text-[8px] font-mono text-slate-700 uppercase font-bold tracking-tighter italic whitespace-nowrap">* Dados gerados por software</div>
                  </div>
                </div>

                <div className="relative flex-1 bg-slate-900/40 rounded-xl border border-white/5 overflow-hidden shadow-inner backdrop-blur-[2px]">
                   <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {[10, 30, 50, 70, 90].map(y => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      ))}
                      
                      <path
                        fill="url(#techGradient)"
                        d={`M -5 100 ${history.map((val, i) => `L ${(i / (history.length - 1)) * 110 - 5} ${100 - (val / 80) * 100}`).join(' ')} L 105 100 Z`}
                        className="transition-all duration-300 opacity-20"
                      />
                      
                      <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="1.2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        points={history.map((val, i) => `${(i / (history.length - 1)) * 110 - 5},${100 - (val / 80) * 100}`).join(' ')}
                        className="transition-all duration-500 drop-shadow-[0_0_8px_#3b82f6]"
                      />

                      {history.filter((_, idx) => idx % 12 === 0).map((val, i) => (
                        <circle 
                          key={i} 
                          cx={`${(i * 12 / (history.length - 1)) * 110 - 5}`} 
                          cy={`${100 - (val / 80) * 100}`} 
                          r="0.5" 
                          fill="#60a5fa" 
                          className="opacity-40"
                        />
                      ))}
                      
                      <defs>
                        <linearGradient id="techGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                   </svg>
                   
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent w-24 h-full animate-[scan_8s_linear_infinite] pointer-events-none"></div>
                </div>

                <div className="mt-4 flex justify-between items-center font-mono text-[9px] uppercase tracking-[0.2em] font-black">
                   <div className="flex gap-4 items-center">
                     <span className="text-slate-600 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></div> HISTÓRICO_VITAL</span>
                     <span className="text-slate-700 hidden md:inline">REF_X: 200ms</span>
                   </div>
                   <div className="text-white px-3 py-1 bg-white/5 rounded-full ring-1 ring-white/10 italic">
                     VALOR_ATUAL: {level.toFixed(1)} cm
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tech" className="grid grid-cols-1 md:grid-cols-2 gap-8 scroll-mt-24">
          <div className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-blue-500/40 hover:bg-slate-900/60 transition-all group">
            <Cpu className="w-12 h-12 text-blue-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black text-white mb-3 italic tracking-widest uppercase">ESP32 & IOT Infrastructure</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              Microcontrolador dual-core com conectividade Wi-Fi nativa. Desenvolvido para processamento de sinais ultrassônicos em baixa latência e envio direto para a infraestrutura Vercel.
            </p>
          </div>
          <div className="p-10 rounded-[2.5rem] bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-cyan-500/40 hover:bg-slate-900/60 transition-all group">
            <Droplets className="w-12 h-12 text-cyan-500 mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black text-white mb-3 italic tracking-widest uppercase">IP67 Ultrasonic Sensing</h3>
            <p className="text-slate-400 text-sm leading-relaxed font-medium">
              O sensor JSN-SR04T industrial utiliza transdutor isolado, garantindo precisão milimétrica mesmo em ambientes saturados por umidade, gases e resíduos urbanos.
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-12 pb-32">
          <div className="md:col-span-2 space-y-10">
             <h3 className="text-3xl font-black italic flex items-center gap-4 tracking-tighter uppercase text-white">
               <Users className="w-8 h-8 text-blue-500" /> Corpo Docente e Acadêmicos
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {members.map((m, i) => (
                  <div key={i} className="px-6 py-5 bg-slate-800/20 border border-slate-700/40 rounded-3xl text-sm font-black uppercase tracking-wider flex items-center justify-between group hover:bg-slate-800/40 transition-all cursor-default">
                    <span className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" /> 
                      {m.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 transition-colors" />
                  </div>
                ))}
             </div>
          </div>
          <div className="p-10 rounded-[3rem] bg-blue-600/5 border border-blue-500/20 self-start backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Monitor className="w-24 h-24" />
            </div>
            <h4 className="text-blue-500 font-black text-xs mb-6 flex items-center gap-2 uppercase italic tracking-[0.3em] relative z-10">
              FACENS_SMART_CITIES // 2026
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-black uppercase tracking-widest relative z-10">
              Engenharia da Computação <br/> 
              1º Semestre - Turma UPX <br/>
              Sorocaba, SP.
            </p>
          </div>
        </section>
      </div>

      {/* FOOTER - Movido para fora e com margem superior maior */}
      <footer className="w-full bg-[#020617] border-t border-slate-800/50 py-16 mt-32">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 group hover:opacity-100 transition-all duration-500">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] italic font-black text-white">Smart Drain Project // Global Systems</p>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Inovação em Drenagem Urbana Inteligente</p>
          </div>
          <div className="flex gap-10">
            <Github className="w-5 h-5 hover:text-blue-500 cursor-pointer transition-all hover:scale-110" />
            <ExternalLink className="w-5 h-5 hover:text-blue-500 cursor-pointer transition-all hover:scale-110" />
          </div>
        </div>
      </footer>
    </div>
  );
}
