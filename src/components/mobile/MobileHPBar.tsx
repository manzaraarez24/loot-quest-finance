import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Heart } from 'lucide-react';

interface MobileHPBarProps {
  hp: number;
  balance: number;
  budget: number;
}

export function MobileHPBar({ hp, balance, budget }: MobileHPBarProps) {
  const isCritical = hp < 20;
  const isWarning = hp >= 20 && hp < 50;
  
  const statusColor = useMemo(() => {
    if (isCritical) return 'text-hp-critical';
    if (isWarning) return 'text-hp-warning';
    return 'text-hp-healthy';
  }, [isCritical, isWarning]);

  const barColor = useMemo(() => {
    if (isCritical) return 'bg-hp-critical';
    if (isWarning) return 'bg-hp-warning';
    return 'bg-hp-healthy';
  }, [isCritical, isWarning]);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <motion.div
            animate={isCritical ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
          >
            <Heart className={`w-5 h-5 ${statusColor} fill-current`} />
          </motion.div>
          <span className={`font-display text-2xl font-bold ${statusColor}`}>
            {hp}%
          </span>
          <span className="text-sm text-muted-foreground">HP</span>
        </div>
        <span className="text-sm text-muted-foreground font-medium">
          ${balance.toLocaleString()} left
        </span>
      </div>

      {/* HP Bar */}
      <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${barColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${hp}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
        
        {/* Critical warning */}
        {isCritical && (
          <motion.div
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            ⚠️
          </motion.div>
        )}
      </div>
    </div>
  );
}
