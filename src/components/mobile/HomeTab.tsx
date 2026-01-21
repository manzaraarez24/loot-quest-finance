import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { BudgetEditor } from './BudgetEditor';
import { MobileHPBar } from './MobileHPBar';
import { MobileXPBar } from './MobileXPBar';
import { MobileAvatar } from './MobileAvatar';
import { MobileStats } from './MobileStats';
import { MobileTransactionList } from './MobileTransactionList';
import { NoSpendDayButton } from '@/components/game/NoSpendDayButton';
import { AvatarAccessory } from '@/types/game';

interface HomeTabProps {
  stats: {
    currentBalance: number;
    monthlyLimit: number;
    hp: number;
    xp: number;
    level: number;
    streakDays: number;
    gems: number;
    totalSaved: number;
  };
  transactions: Array<{
    id: string;
    type: 'expense' | 'income';
    amount: number;
    category: string;
    description: string;
    date: Date;
  }>;
  equippedAccessories: {
    hat?: AvatarAccessory;
    weapon?: AvatarAccessory;
    aura?: AvatarAccessory;
    pet?: AvatarAccessory;
  };
  getXPProgress: (xp: number, level: number) => number;
  onClaimNoSpendDay: () => Promise<void>;
  onUpdateBudget: (newBudget: number) => Promise<void>;
  onEquipAccessory: (accessory: AvatarAccessory) => void;
}

export function HomeTab({
  stats,
  transactions,
  equippedAccessories,
  getXPProgress,
  onClaimNoSpendDay,
  onUpdateBudget,
  onEquipAccessory,
}: HomeTabProps) {
  return (
    <div className="space-y-4 pb-24">
      {/* HP and Budget Section */}
      <GlassCard 
        glow="green" 
        className="p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <MobileHPBar hp={stats.hp} balance={stats.currentBalance} budget={stats.monthlyLimit} />
        <div className="mt-4">
          <BudgetEditor
            currentBudget={stats.monthlyLimit}
            onUpdateBudget={onUpdateBudget}
            balance={stats.currentBalance}
            hp={stats.hp}
          />
        </div>
      </GlassCard>

      {/* Avatar + XP Section */}
      <GlassCard
        className="p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-4">
          <MobileAvatar 
            hp={stats.hp} 
            level={stats.level}
            equippedAccessories={equippedAccessories}
            onEquipAccessory={onEquipAccessory}
          />
          <div className="flex-1">
            <MobileXPBar 
              xp={stats.xp} 
              level={stats.level} 
              progress={getXPProgress(stats.xp, stats.level)} 
            />
          </div>
        </div>
      </GlassCard>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <MobileStats 
          streakDays={stats.streakDays} 
          gems={stats.gems} 
          totalSaved={stats.totalSaved} 
        />
      </motion.div>

      {/* No Spend Day */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <NoSpendDayButton 
          onClaim={onClaimNoSpendDay} 
          streakDays={stats.streakDays} 
        />
      </motion.div>

      {/* Recent Transactions */}
      <GlassCard
        variant="subtle"
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MobileTransactionList transactions={transactions} />
      </GlassCard>
    </div>
  );
}
