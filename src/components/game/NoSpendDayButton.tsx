import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Gift, Zap } from 'lucide-react';

interface NoSpendDayProps {
  onClaim: () => void;
  streakDays: number;
}

export function NoSpendDayButton({ onClaim, streakDays }: NoSpendDayProps) {
  return (
    <motion.div
      className="glass-panel p-6 border border-neon-cyan/30 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-green/5" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-neon-cyan" />
          <h3 className="font-display text-lg font-bold text-neon-cyan">
            No Spend Day?
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Didn't spend money today? Claim your daily bonus and open a loot box!
        </p>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Current streak: <span className="text-neon-orange font-bold">{streakDays} days</span>
          </div>
          
          <Button
            onClick={onClaim}
            className="bg-gradient-to-r from-neon-cyan to-neon-green text-background font-display shadow-[0_0_20px_hsl(var(--neon-cyan)/0.4)] hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.6)]"
          >
            <Gift className="w-4 h-4 mr-2" />
            Claim Bonus
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
