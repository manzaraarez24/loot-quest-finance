import { motion } from 'framer-motion';
import { LEVEL_THRESHOLDS } from '@/types/game';
import { Star } from 'lucide-react';

interface MobileXPBarProps {
  xp: number;
  level: number;
  progress: number;
}

export function MobileXPBar({ xp, level, progress }: MobileXPBarProps) {
  const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  const xpToNextLevel = nextLevelXP - xp;

  return (
    <div className="space-y-2">
      {/* Level Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-foreground">Level {level}</span>
            <p className="text-[10px] text-muted-foreground">{xpToNextLevel} XP to next</p>
          </div>
        </div>
        <span className="font-display text-sm text-neon-purple">{xp.toLocaleString()} XP</span>
      </div>

      {/* XP Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-neon-purple to-neon-pink rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>
    </div>
  );
}
