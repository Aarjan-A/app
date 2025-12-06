export default function Splash() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] flex items-center justify-center relative overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 text-center">
        <div className="mb-6 flex justify-center">
          {/* Runna-style D logo */}
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-[32px] shadow-[0_0_60px_rgba(59,130,246,0.6)] animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="font-heading font-bold text-7xl text-white tracking-tight">D</div>
            </div>
          </div>
        </div>
        
        <h1 className="font-heading font-light text-6xl tracking-tight text-white mb-2">
          Doerly
        </h1>
        <p className="font-body text-lg text-slate-300">Life Tasks, Done For You</p>
      </div>
    </div>
  );
}