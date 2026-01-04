import { motion } from 'framer-motion';
import { Dungeon } from '@/types/game';
import { MapPin, Skull, Crown, Lock } from 'lucide-react';

interface DungeonMapProps {
  dungeons: Dungeon[];
}

export function DungeonMap({ dungeons }: DungeonMapProps) {
  const getDifficultyColor = (difficulty: Dungeon['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-neon-green border-neon-green/50 bg-neon-green/10';
      case 'medium': return 'text-hp-warning border-hp-warning/50 bg-hp-warning/10';
      case 'hard': return 'text-neon-purple border-neon-purple/50 bg-neon-purple/10';
      case 'nightmare': return 'text-hp-critical border-hp-critical/50 bg-hp-critical/10';
    }
  };

  const getDifficultyLabel = (difficulty: Dungeon['difficulty']) => {
    switch (difficulty) {
      case 'easy': return '⭐';
      case 'medium': return '⭐⭐';
      case 'hard': return '⭐⭐⭐';
      case 'nightmare': return '💀';
    }
  };

  return (
    <div className="glass-panel border border-neon-purple/30 p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-neon-purple" />
        <h3 className="font-display text-lg font-bold text-foreground">
          Expense Dungeons
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {dungeons.map((dungeon, index) => {
          const progress = (dungeon.spent / dungeon.totalBudget) * 100;
          const isOverBudget = progress > 100;
          const isConquered = dungeon.conquered;

          return (
            <motion.div
              key={dungeon.id}
              className={`relative p-3 rounded-lg border ${getDifficultyColor(dungeon.difficulty)} ${
                isConquered ? 'opacity-60' : ''
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Conquered overlay */}
              {isConquered && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg">
                  <Crown className="w-8 h-8 text-neon-green" />
                </div>
              )}

              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{dungeon.icon}</span>
                <span className="text-xs">{getDifficultyLabel(dungeon.difficulty)}</span>
              </div>

              <h4 className="font-display text-xs font-bold truncate mb-1">
                {dungeon.name}
              </h4>

              {/* Progress bar */}
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden border border-border/30">
                <motion.div
                  className={`h-full ${isOverBudget ? 'bg-hp-critical' : 'bg-neon-green'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>

              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  ${dungeon.spent.toFixed(0)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ${dungeon.totalBudget.toFixed(0)}
                </span>
              </div>

              {/* Monsters indicator */}
              <div className="flex items-center gap-1 mt-2">
                <Skull className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {dungeon.monstersDefeated} defeated
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-neon-green" /> Easy
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-hp-warning" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-neon-purple" /> Hard
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-hp-critical" /> Nightmare
          </span>
        </div>
      </div>
    </div>
  );
}