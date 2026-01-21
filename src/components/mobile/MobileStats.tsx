import { motion } from 'framer-motion';
import { Flame, Gem, TrendingUp } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface MobileStatsProps {
  streakDays: number;
  gems: number;
  totalSaved: number;
}

export function MobileStats({ streakDays, gems, totalSaved }: MobileStatsProps) {
  const stats = [
    {
      icon: Flame,
      label: 'Streak',
      value: streakDays,
      unit: 'days',
      color: 'text-neon-orange',
      glow: 'pink' as const,
    },
    {
      icon: Gem,
      label: 'Gems',
      value: gems,
      unit: '',
      color: 'text-neon-cyan',
      glow: 'cyan' as const,
    },
    {
      icon: TrendingUp,
      label: 'Saved',
      value: totalSaved,
      unit: '',
      prefix: '$',
      color: 'text-hp-healthy',
      glow: 'green' as const,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <GlassCard
          key={stat.label}
          variant="subtle"
          className="p-3 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-1`} />
          <p className={`font-display text-lg font-bold ${stat.color}`}>
            {stat.prefix}{stat.value.toLocaleString()}{stat.unit && <span className="text-xs ml-0.5">{stat.unit}</span>}
          </p>
          <p className="text-[10px] text-muted-foreground">{stat.label}</p>
        </GlassCard>
      ))}
    </div>
  );
}
