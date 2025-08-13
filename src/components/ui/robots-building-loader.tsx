export const RobotsBuildingLoader = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-background p-8">
        <style>
          {`
            @keyframes robot-move-1 {
              0% { motion-offset: 0%; }
              100% { motion-offset: 100%; }
            }
            @keyframes robot-move-2 {
              0% { motion-offset: 0%; }
              100% { motion-offset: 100%; }
            }
            @keyframes draw-line {
              from { stroke-dashoffset: 1000; }
              to { stroke-dashoffset: 0; }
            }
            @keyframes fade-in {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .robot-1 { animation: robot-move-1 5s linear infinite; }
            .robot-2 { animation: robot-move-2 6s linear infinite 0.5s; }
            .building-line {
              stroke-dasharray: 1000;
              stroke-dashoffset: 1000;
              animation: draw-line 5s ease-out forwards;
            }
            .fade-in-text {
              animation: fade-in 2s ease-in-out forwards;
            }
          `}
        </style>
        <svg viewBox="0 0 400 300" className="w-full max-w-md h-auto">
          {/* Robots */}
          <g className="robot-1">
            <path d="M0 0-2-6-4-6-4-8-6-8-6-10-8-10-8-12-6-12-6-14-4-14-4-12-2-12-2-10 0-10 0-8 2-8 2-6 4-6 4-8 6-8 6-10 8-10 8-12 6-12 6-14 4-14 4-12 2-12 2-10 0-10z" fill="hsl(var(--accent))" transform="translate(10, 10) scale(1.5)">
                <animateMotion dur="5s" repeatCount="indefinite" path="M50,250 C100,100 250,100 300,250" />
            </path>
          </g>
          <g className="robot-2">
            <path d="M-6-16l6 4 6-4" fill="none" stroke="hsl(var(--accent))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <animateMotion dur="6s" repeatCount="indefinite" path="M350,50 C300,200 150,200 100,50" />
            </path>
            <circle r="4" fill="hsl(var(--accent))">
                 <animateMotion dur="6s" repeatCount="indefinite" path="M350,50 C300,200 150,200 100,50" />
            </circle>
          </g>
  
          {/* Structure being built */}
          <rect className="building-line" x="50" y="50" width="300" height="200" rx="10" stroke="hsl(var(--accent))" strokeWidth="2" fill="none" />
          <line className="building-line" x1="50" y1="90" x2="350" y2="90" stroke="hsl(var(--border))" strokeWidth="1.5" style={{ animationDelay: '1s' }} />
          <line className="building-line" x1="70" y1="110" x2="200" y2="110" stroke="hsl(var(--border))" strokeWidth="1" style={{ animationDelay: '1.5s' }} />
          <line className="building-line" x1="70" y1="130" x2="250" y2="130" stroke="hsl(var(--border))" strokeWidth="1" style={{ animationDelay: '1.8s' }} />
           <line className="building-line" x1="70" y1="150" x2="180" y2="150" stroke="hsl(var(--border))" strokeWidth="1" style={{ animationDelay: '2.1s' }} />
        </svg>
        <div className="text-center mt-4">
          <p className="text-lg font-headline font-semibold text-primary fade-in-text">Robots at Work</p>
          <p className="text-muted-foreground fade-in-text" style={{ animationDelay: '0.5s' }}>Assembling components...</p>
        </div>
      </div>
    );
  };
