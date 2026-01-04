import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { AvatarMood } from '@/types/game';

interface GameAvatarProps {
  hp: number;
  level: number;
  isAnimating?: boolean;
}

export function GameAvatar({ hp, level, isAnimating = false }: GameAvatarProps) {
  const mood: AvatarMood = useMemo(() => {
    if (hp >= 80) return 'ecstatic';
    if (hp >= 60) return 'happy';
    if (hp >= 40) return 'neutral';
    if (hp >= 20) return 'worried';
    return 'critical';
  }, [hp]);

  const avatarEmoji = useMemo(() => {
    switch (mood) {
      case 'ecstatic': return '🤩';
      case 'happy': return '😊';
      case 'neutral': return '😐';
      case 'worried': return '😰';
      case 'critical': return '😵';
    }
  }, [mood]);

  const ringColor = useMemo(() => {
    switch (mood) {
      case 'ecstatic':
      case 'happy':
        return 'border-hp-healthy shadow-[0_0_30px_hsl(var(--hp-healthy)/0.5)]';
      case 'neutral':
        return 'border-hp-warning shadow-[0_0_20px_hsl(var(--hp-warning)/0.3)]';
      case 'worried':
      case 'critical':
        return 'border-hp-critical shadow-[0_0_30px_hsl(var(--hp-critical)/0.5)]';
    }
  }, [mood]);

  const bgGradient = useMemo(() => {
    switch (mood) {
      case 'ecstatic':
      case 'happy':
        return 'from-hp-healthy/20 to-transparent';
      case 'neutral':
        return 'from-hp-warning/20 to-transparent';
      case 'worried':
      case 'critical':
        return 'from-hp-critical/20 to-transparent';
    }
  }, [mood]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Level badge */}
      <motion.div
        className="absolute -top-2 -right-2 z-10 bg-neon-pink text-primary-foreground font-display text-xs font-bold px-2 py-1 rounded-full border-2 border-background shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        LVL {level}
      </motion.div>

      {/* Avatar container */}
      <motion.div
        className={`relative w-32 h-32 rounded-full border-4 ${ringColor} bg-gradient-to-br ${bgGradient} flex items-center justify-center overflow-hidden`}
        animate={
          mood === 'critical'
            ? { x: [-2, 2, -2, 2, 0] }
            : mood === 'ecstatic'
            ? { y: [0, -5, 0] }
            : {}
        }
        transition={
          mood === 'critical'
            ? { duration: 0.4, repeat: Infinity }
            : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* Inner glow */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${bgGradient} opacity-50`} />
        
        {/* Avatar emoji */}
        <motion.span
          className="text-6xl relative z-10"
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {avatarEmoji}
        </motion.span>

        {/* Scan effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-transparent"
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Status text */}
      <motion.div
        className={`mt-3 font-display text-sm uppercase tracking-wider ${
          mood === 'critical' ? 'text-hp-critical' : mood === 'worried' ? 'text-hp-warning' : 'text-hp-healthy'
        }`}
        animate={mood === 'critical' ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {mood === 'ecstatic' && '✨ THRIVING ✨'}
        {mood === 'happy' && 'Doing Great'}
        {mood === 'neutral' && 'Stable'}
        {mood === 'worried' && '⚠️ Low Funds'}
        {mood === 'critical' && '🚨 CRITICAL 🚨'}
      </motion.div>
    </div>
  );
}
