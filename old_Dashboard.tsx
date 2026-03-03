import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameData } from '@/hooks/useGameData';
import { useAuth } from '@/contexts/AuthContext';
import { LootBoxModal } from '@/components/game/LootBoxModal';
import { LootBoxResult } from '@/types/game';
import { Loader2, Shield, Wallet } from 'lucide-react';

// Mobile components
import { BottomNav } from '@/components/mobile/BottomNav';
import { QuickAddSheet } from '@/components/mobile/QuickAddSheet';
import { HomeTab } from '@/components/mobile/HomeTab';
import { BattleTab } from '@/components/mobile/BattleTab';
import { OracleTab } from '@/components/mobile/OracleTab';
import { ProfileTab } from '@/components/mobile/ProfileTab';

const Dashboard = () => {
  const { signOut, user } = useAuth();
  const {
    loading,
    stats,
    transactions,
    inventory,
    bosses,
    dungeons,
    equippedAccessories,
    addExpense,
    addIncome,
    openLootBox,
    claimNoSpendDay,
    getXPProgress,
    defeatBoss,
    equipAccessory,
    updateBudget,
    updateBudgetSettings,
  } = useGameData();

  const [activeTab, setActiveTab] = useState('home');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isLootBoxOpen, setIsLootBoxOpen] = useState(false);
  const [lootResult, setLootResult] = useState<LootBoxResult | null>(null);

  const handleClaimNoSpendDay = async () => {
    const result = await claimNoSpendDay();
    setLootResult(result.lootBox);
    setIsLootBoxOpen(true);
  };

  const handleOpenLootBox = async () => {
    const result = await openLootBox();
    return result;
  };

  const handleDefeatBoss = async (bossId: string, amount: number) => {
    const result = await defeatBoss(bossId, amount);
    if (result && 'item' in result) {
      setLootResult(result as LootBoxResult);
      setIsLootBoxOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full liquid-glass flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-neon-green animate-spin" />
            </div>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-neon-green/30"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
          <p className="text-neon-green font-display text-sm">Loading adventure...</p>
        </div>
      </div>
    );
  }

  // Convert transactions for type compatibility
  const formattedTransactions = transactions.map(t => ({
    ...t,
    date: new Date(t.date),
  }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-80 h-80 bg-neon-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-neon-pink/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/3 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Main Content */}
      <div className="relative z-10 px-4 pt-safe">
        {/* Header */}
        <motion.header
          className="py-4 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Shield className="w-6 h-6 text-neon-green" />
          <h1 className="font-display text-2xl font-black tracking-tight">
            <span className="text-neon-green neon-text-green">LOOT</span>
            <span className="text-neon-pink neon-text-pink">BAG</span>
          </h1>
          <Wallet className="w-6 h-6 text-neon-pink" />
        </motion.header>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <HomeTab
                stats={stats}
                transactions={formattedTransactions}
                equippedAccessories={equippedAccessories}
                getXPProgress={getXPProgress}
                onClaimNoSpendDay={handleClaimNoSpendDay}
                onUpdateBudget={updateBudget}
                onEquipAccessory={equipAccessory}
              />
            </motion.div>
          )}

          {activeTab === 'battle' && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <BattleTab
                bosses={bosses}
                dungeons={dungeons}
                onDefeatBoss={handleDefeatBoss}
              />
            </motion.div>
          )}

          {activeTab === 'oracle' && (
            <motion.div
              key="oracle"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <OracleTab
                stats={stats}
                transactions={formattedTransactions}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <ProfileTab
                email={user?.email || ''}
                stats={{
                  level: stats.level,
                  xp: stats.xp,
                  gems: stats.gems,
                  streakDays: stats.streakDays,
                }}
                budgetSettings={{
                  monthlyLimit: stats.monthlyLimit,
                  expectedExpenses: stats.expectedExpenses,
                }}
                inventoryCount={inventory.length}
                onSignOut={signOut}
                onUpdateBudgetSettings={updateBudgetSettings}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Quick Add Sheet */}
      <QuickAddSheet
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddExpense={addExpense}
        onAddIncome={addIncome}
      />

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
