import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameData } from '@/hooks/useGameData';
import { useAuth } from '@/contexts/AuthContext';
import { HPBar } from '@/components/game/HPBar';
import { AvatarEvolution } from '@/components/game/AvatarEvolution';
import { XPBar } from '@/components/game/XPBar';
import { StatsDisplay } from '@/components/game/StatsDisplay';
import { TransactionForm } from '@/components/game/TransactionForm';
import { TransactionList } from '@/components/game/TransactionList';
import { NoSpendDayButton } from '@/components/game/NoSpendDayButton';
import { LootBoxModal } from '@/components/game/LootBoxModal';
import { SpendingPersonaCard } from '@/components/game/SpendingPersona';
import { BossFight } from '@/components/game/BossFight';
import { CurrencySelector } from '@/components/game/CurrencySelector';
import { DungeonMap } from '@/components/game/DungeonMap';
import { SpendingProphecyCard } from '@/components/game/SpendingProphecy';
import { RegretCalculator } from '@/components/game/RegretCalculator';
import { LootBoxResult } from '@/types/game';
import { Wallet, Shield, LogOut, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
    addBoss,
    updateBoss,
    deleteBoss,
  } = useGameData();

  const [isLootBoxOpen, setIsLootBoxOpen] = useState(false);
  const [lootResult, setLootResult] = useState<LootBoxResult | null>(null);
  const [isAvatarAnimating, setIsAvatarAnimating] = useState(false);

  const handleClaimNoSpendDay = async () => {
    const result = await claimNoSpendDay();
    setLootResult(result.lootBox);
    setIsLootBoxOpen(true);
    setIsAvatarAnimating(true);
    setTimeout(() => setIsAvatarAnimating(false), 500);
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
      <div className="min-h-screen bg-background cyber-grid scanline flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-neon-green animate-spin" />
          <p className="text-neon-green font-display">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background cyber-grid scanline relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-neon-pink/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1 flex justify-start">
              <CurrencySelector />
            </div>
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-8 h-8 text-neon-green" />
              <h1 className="font-display text-4xl font-black text-foreground tracking-tight">
                <span className="text-neon-green neon-text-green">LOOT</span>
                <span className="text-neon-pink neon-text-pink">BAG</span>
              </h1>
              <Wallet className="w-8 h-8 text-neon-pink" />
            </div>
            <div className="flex-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground hover:text-neon-pink"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            Welcome back, {user?.email?.split('@')[0]}! Level up your finances.
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

        {/* Tabs for different views */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full mb-6 bg-muted/30 border border-border/50 p-1 rounded-lg grid grid-cols-4">
            <TabsTrigger value="dashboard" className="font-display text-xs px-1">
              🎮 Dashboard
            </TabsTrigger>
            <TabsTrigger value="battle" className="font-display text-xs px-1">
              ⚔️ Battle
            </TabsTrigger>
            <TabsTrigger value="oracle" className="font-display text-xs px-1">
              🔮 Oracle
            </TabsTrigger>
            <TabsTrigger value="profile" className="font-display text-xs px-1">
              👤 Profile
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
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
                    <AvatarEvolution
                      hp={stats.hp}
                      level={stats.level}
                      isAnimating={isAvatarAnimating}
                      equippedAccessories={equippedAccessories}
                      onEquipAccessory={equipAccessory}
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

                {/* Spending Persona */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <SpendingPersonaCard transactions={transactions} />
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
                {inventory.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No items yet. Claim a No-Spend Day to earn loot!</p>
                ) : (
                  inventory.map((item) => (
                    <motion.div
                      key={item.id}
                      className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${item.rarity === 'legendary'
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
                  ))
                )}
              </div>
            </motion.section>
          </TabsContent>

          {/* Battle Zone Tab */}
          <TabsContent value="battle">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Boss Fights */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <BossFight
                  bosses={bosses}
                  onDefeatBoss={handleDefeatBoss}
                  onAddBoss={addBoss}
                  onUpdateBoss={updateBoss}
                  onDeleteBoss={deleteBoss}
                />
              </motion.section>

              {/* Dungeon Map */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <DungeonMap dungeons={dungeons} />
              </motion.section>
            </div>
          </TabsContent>

          {/* Oracle Tab */}
          <TabsContent value="oracle">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Spending Prophecy */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <SpendingProphecyCard stats={stats} transactions={transactions} />
              </motion.section>

              {/* Regret Calculator */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <RegretCalculator />
              </motion.section>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
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
          </TabsContent>
        </Tabs>
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
