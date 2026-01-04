import { motion } from 'framer-motion';
import { Flame, Gem, TrendingUp } from 'lucide-react';

interface StatsDisplayProps {
  streakDays: number;
  gems: number;
  totalSaved: number;
}

export function StatsDisplay({ streakDays, gems, totalSaved }: StatsDisplayProps) {
  const stats = [
    {
      icon: Flame,
      label: 'Streak',
      value: `${streakDays} days`,
      color: 'text-neon-orange',
      bgColor: 'bg-neon-orange/10',
      borderColor: 'border-neon-orange/30',
    },
    {
      icon: Gem,
      label: 'Gems',
      value: gems.toString(),
      color: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan/10',
      borderColor: 'border-neon-cyan/30',
    },
    {
      icon: TrendingUp,
      label: 'Saved',
      value: `$${totalSaved.toLocaleString()}`,
      color: 'text-hp-healthy',
      bgColor: 'bg-hp-healthy/10',
      borderColor: 'border-hp-healthy/30',
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`flex flex-col items-center p-4 rounded-lg ${stat.bgColor} border ${stat.borderColor} backdrop-blur-sm`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <stat.icon className={`w-5 h-5 ${stat.color} mb-1`} />
          <span className={`font-display text-lg font-bold ${stat.color}`}>
            {stat.value}
          </span>
          <span className="text-xs text-muted-foreground font-body">
            {stat.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
