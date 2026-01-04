import { motion, AnimatePresence } from 'framer-motion';
import { Boss } from '@/types/game';
import { useState } from 'react';
import { Sword, Shield, Trophy, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BossFightProps {
  bosses: Boss[];
  onDefeatBoss: (bossId: string, amount: number) => void;
}

export function BossFight({ bosses, onDefeatBoss }: BossFightProps) {
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [isAttacking, setIsAttacking] = useState(false);

  const activeBosses = bosses.filter(b => !b.defeated);
  const defeatedBosses = bosses.filter(b => b.defeated);

  const handleAttack = (boss: Boss) => {
    setIsAttacking(true);
    setTimeout(() => {
      onDefeatBoss(boss.id, boss.currentHP);
      setIsAttacking(false);
      setSelectedBoss(null);
    }, 1000);
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getBossTypeColor = (type: Boss['type']) => {
    switch (type) {
      case 'bill': return 'border-neon-green/50 bg-neon-green/10';
      case 'subscription': return 'border-neon-purple/50 bg-neon-purple/10';
      case 'debt': return 'border-hp-critical/50 bg-hp-critical/10';
    }
  };

  return (
    <div className="glass-panel border border-hp-critical/30 p-4 rounded-xl">
      <div className="flex items-center gap-2 mb-4">
        <Sword className="w-5 h-5 text-hp-critical" />
        <h3 className="font-display text-lg font-bold text-foreground">
          Boss Fights
        </h3>
        {activeBosses.length > 0 && (
          <span className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-hp-critical/20 text-hp-critical">
            {activeBosses.length} ACTIVE
          </span>
        )}
      </div>

      {activeBosses.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-2 text-neon-green/50" />
          <p className="text-sm">All bosses defeated! 🎉</p>
          <p className="text-xs mt-1">New bosses appear when bills are due</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeBosses.map((boss) => {
            const daysLeft = getDaysUntilDue(boss.dueDate);
            const hpPercent = (boss.currentHP / boss.totalHP) * 100;
            const isUrgent = daysLeft <= 3;

            return (
              <motion.div
                key={boss.id}
                className={`p-3 rounded-lg border ${getBossTypeColor(boss.type)} ${isUrgent ? 'animate-pulse-glow' : ''}`}
                layoutId={boss.id}
                onClick={() => setSelectedBoss(boss)}
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-3xl"
                    animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    {boss.icon}
                  </motion.span>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-bold">{boss.name}</span>
                      <span className={`text-xs font-bold ${isUrgent ? 'text-hp-critical' : 'text-muted-foreground'}`}>
                        <Clock className="w-3 h-3 inline mr-1" />
                        {daysLeft}d left
                      </span>
                    </div>
                    
                    {/* Boss HP Bar */}
                    <div className="mt-2 h-3 bg-muted/50 rounded-full overflow-hidden border border-border/30">
                      <motion.div
                        className="h-full bg-gradient-to-r from-hp-critical to-hp-warning"
                        initial={{ width: 0 }}
                        animate={{ width: `${hpPercent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        ${boss.currentHP.toFixed(0)} / ${boss.totalHP.toFixed(0)}
                      </span>
                      <span className="text-xs text-neon-green">
                        +{boss.reward.xp} XP · +{boss.reward.gems} 💎
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  className="w-full mt-3 bg-hp-critical/20 hover:bg-hp-critical/30 text-hp-critical border border-hp-critical/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAttack(boss);
                  }}
                  disabled={isAttacking}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Pay & Defeat
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Defeated bosses trophy case */}
      {defeatedBosses.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">
            <Trophy className="w-3 h-3 inline mr-1" /> Defeated
          </p>
          <div className="flex flex-wrap gap-2">
            {defeatedBosses.map((boss) => (
              <motion.div
                key={boss.id}
                className="px-2 py-1 rounded-lg bg-neon-green/10 border border-neon-green/30 text-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <span className="mr-1">{boss.icon}</span>
                <span className="text-neon-green">✓</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Attack animation overlay */}
      <AnimatePresence>
        {isAttacking && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: 0 }}
              animate={{ scale: [0.5, 1.5, 1], rotate: [0, 360, 360] }}
              transition={{ duration: 0.8 }}
              className="text-8xl"
            >
              ⚔️
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}