import { motion } from 'framer-motion';
import { LEVEL_THRESHOLDS } from '@/types/game';

interface XPBarProps {
  xp: number;
  level: number;
  progress: number;
}

export function XPBar({ xp, level, progress }: XPBarProps) {
  const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-xs text-neon-purple">
          XP: {xp.toLocaleString()}
        </span>
        <span className="font-body text-xs text-muted-foreground">
          {nextLevelXP - xp} to Level {level + 1}
        </span>
      </div>
      
      <div className="relative h-3 bg-muted rounded-full overflow-hidden border border-neon-purple/30">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-purple to-neon-pink"
          style={{ boxShadow: '0 0 15px hsl(var(--neon-purple) / 0.5)' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        
        {/* Sparkle effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* XP range labels */}
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted-foreground font-display">
          {currentLevelXP}
        </span>
        <span className="text-[10px] text-muted-foreground font-display">
          {nextLevelXP}
        </span>
      </div>
    </div>
  );
}
