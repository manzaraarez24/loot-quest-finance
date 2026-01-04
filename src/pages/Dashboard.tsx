import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '@/hooks/useGameState';
import { HPBar } from '@/components/game/HPBar';
import { GameAvatar } from '@/components/game/GameAvatar';
import { XPBar } from '@/components/game/XPBar';
import { StatsDisplay } from '@/components/game/StatsDisplay';
import { TransactionForm } from '@/components/game/TransactionForm';
import { TransactionList } from '@/components/game/TransactionList';
import { NoSpendDayButton } from '@/components/game/NoSpendDayButton';
import { LootBoxModal } from '@/components/game/LootBoxModal';
import { LootBoxResult } from '@/types/game';
import { Wallet, Shield } from 'lucide-react';

const Dashboard = () => {
  const {
    stats,
    transactions,
    inventory,
    addExpense,
    addIncome,
    openLootBox,
    claimNoSpendDay,
    getXPProgress,
  } = useGameState();

  const [isLootBoxOpen, setIsLootBoxOpen] = useState(false);
  const [lootResult, setLootResult] = useState<LootBoxResult | null>(null);
  const [isAvatarAnimating, setIsAvatarAnimating] = useState(false);

  const handleClaimNoSpendDay = () => {
    const result = claimNoSpendDay();
    setLootResult(result.lootBox);
    setIsLootBoxOpen(true);
    setIsAvatarAnimating(true);
    setTimeout(() => setIsAvatarAnimating(false), 500);
  };

  const handleOpenLootBox = () => {
    const result = openLootBox();
    return result;
  };

  return (
    <div className="min-h-screen bg-background cyber-grid scanline relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-neon-green" />
            <h1 className="font-display text-4xl font-black text-foreground tracking-tight">
              <span className="text-neon-green neon-text-green">LOOT</span>
              <span className="text-neon-pink neon-text-pink">BAG</span>
            </h1>
            <Wallet className="w-8 h-8 text-neon-pink" />
          </div>
          <p className="text-sm text-muted-foreground font-body">
            Level up your finances. Protect your loot.
          </p>
        </motion.header>

        {/* HP Bar - Prominent at top */}
        <motion.section
          className="glass-panel p-6 mb-6 border border-neon-green/30"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <HPBar
            current={stats.currentBalance}
            max={stats.monthlyLimit}
            hp={stats.hp}
          />
        </motion.section>

        {/* Main grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Avatar + XP */}
            <motion.section
              className="glass-panel p-6 border border-border/50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col items-center">
                <GameAvatar
                  hp={stats.hp}
                  level={stats.level}
                  isAnimating={isAvatarAnimating}
                />
                <div className="w-full mt-6">
                  <XPBar
                    xp={stats.xp}
                    level={stats.level}
                    progress={getXPProgress(stats.xp, stats.level)}
                  />
                </div>
              </div>
            </motion.section>

            {/* Stats display */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatsDisplay
                streakDays={stats.streakDays}
                gems={stats.gems}
                totalSaved={stats.totalSaved}
              />
            </motion.section>

            {/* No Spend Day */}
            <motion.section
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <NoSpendDayButton
                onClaim={handleClaimNoSpendDay}
                streakDays={stats.streakDays}
              />
            </motion.section>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Transaction form */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <TransactionForm
                onAddExpense={addExpense}
                onAddIncome={addIncome}
              />
            </motion.section>

            {/* Recent transactions */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TransactionList transactions={transactions} />
            </motion.section>
          </div>
        </div>

        {/* Inventory preview */}
        <motion.section
          className="mt-6 glass-panel p-6 border border-neon-purple/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-display text-lg font-bold text-neon-purple mb-4">
            🎒 Your Inventory ({inventory.length} items)
          </h3>
          <div className="flex flex-wrap gap-3">
            {inventory.map((item) => (
              <motion.div
                key={item.id}
                className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                  item.rarity === 'legendary'
                    ? 'bg-neon-orange/10 border-neon-orange/50'
                    : item.rarity === 'rare'
                    ? 'bg-neon-purple/10 border-neon-purple/50'
                    : 'bg-muted/50 border-border'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm font-medium">{item.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Loot Box Modal */}
      <LootBoxModal
        isOpen={isLootBoxOpen}
        onClose={() => {
          setIsLootBoxOpen(false);
          setLootResult(null);
        }}
        result={lootResult}
        onOpen={handleOpenLootBox}
      />
    </div>
  );
};

export default Dashboard;
