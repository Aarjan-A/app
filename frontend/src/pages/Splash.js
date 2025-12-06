import { Zap } from 'lucide-react';

export default function Splash() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent" />
      
      <div className="relative z-10 text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.5)] animate-pulse">
            <Zap className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className="font-heading font-light text-6xl tracking-tight text-white mb-2">
          Doerly
        </h1>
        <p className="font-body text-lg text-slate-400">Life Tasks, Done For You</p>
      </div>
    </div>
  );
}
