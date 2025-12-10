export default function Splash() {
  return (
    <div
      data-testid="splash-screen"
      className="min-h-screen bg-[#0F1419] flex items-center justify-center relative overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 text-center">
        <div className="mb-8 flex justify-center">
          {/* Runna-style D with dot above - Clean and minimal */}
          <div className="relative">
            {/* Main D letter */}
            <div className="text-[120px] font-bold text-white tracking-tight" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: 1 }}>
              D
            </div>
            {/* Dot above */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full" />
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