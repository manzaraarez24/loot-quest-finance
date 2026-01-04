import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface HPBarProps {
  current: number;
  max: number;
  hp: number;
}

export function HPBar({ current, max, hp }: HPBarProps) {
  const isCritical = hp < 20;
  const isWarning = hp >= 20 && hp < 50;
  
  const barColor = useMemo(() => {
    if (isCritical) return 'bg-hp-critical';
    if (isWarning) return 'bg-hp-warning';
    return 'bg-hp-healthy';
  }, [isCritical, isWarning]);

  const glowColor = useMemo(() => {
    if (isCritical) return 'shadow-[0_0_30px_hsl(var(--hp-critical)/0.6)]';
    if (isWarning) return 'shadow-[0_0_20px_hsl(var(--hp-warning)/0.4)]';
    return 'shadow-[0_0_20px_hsl(var(--hp-healthy)/0.4)]';
  }, [isCritical, isWarning]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-display text-sm text-muted-foreground">HP</span>
          <motion.span 
            className={`font-display text-2xl font-bold ${isCritical ? 'text-hp-critical neon-text-pink' : isWarning ? 'text-hp-warning' : 'text-hp-healthy neon-text-green'}`}
            animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
          >
            {hp}%
          </motion.span>
        </div>
        <span className="font-body text-sm text-muted-foreground">
          ${current.toLocaleString()} / ${max.toLocaleString()}
        </span>
      </div>
      
      <div className="relative h-8 bg-muted rounded-full overflow-hidden border border-border">
        {/* Background scanlines */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />
        </div>
        
        {/* HP Bar fill */}
        <motion.div
          className={`h-full ${barColor} ${glowColor} ${isCritical ? 'animate-pulse-glow' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${hp}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 to-transparent" />
          
          {/* Moving highlight */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Damage marks when low */}
        {isCritical && (
          <motion.div
            className="absolute right-2 top-1/2 -translate-y-1/2 text-lg"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            ⚠️
          </motion.div>
        )}
      </div>

      {/* HP segments */}
      <div className="flex justify-between mt-1 px-1">
        {[0, 25, 50, 75, 100].map((mark) => (
          <div key={mark} className="flex flex-col items-center">
            <div className={`w-0.5 h-2 ${hp >= mark ? barColor : 'bg-muted-foreground/30'}`} />
            <span className="text-[10px] text-muted-foreground font-display">{mark}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
