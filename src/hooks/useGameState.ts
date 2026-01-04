import { useState, useCallback } from 'react';
import { 
  UserStats, 
  Transaction, 
  LootItem, 
  LootBoxResult, 
  Boss, 
  Dungeon,
  AvatarAccessory,
  LEVEL_THRESHOLDS, 
  LOOT_POOL,
  DUNGEON_TEMPLATES
} from '@/types/game';

const INITIAL_STATS: UserStats = {
  currentBalance: 1850,
  monthlyLimit: 2500,
  hp: 74,
  xp: 340,
  level: 3,
  streakDays: 5,
  totalSaved: 650,
  gems: 25,
};

const INITIAL_BOSSES: Boss[] = [
  {
    id: 'boss_rent',
    name: 'Landlord Dragon',
    icon: '🏠',
    type: 'bill',
    totalHP: 1200,
    currentHP: 1200,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    reward: { xp: 200, gems: 10, lootChance: 0.3 },
    defeated: false,
  },
  {
    id: 'boss_netflix',
    name: 'Streaming Specter',
    icon: '📺',
    type: 'subscription',
    totalHP: 15.99,
    currentHP: 15.99,
    dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    reward: { xp: 30, gems: 2, lootChance: 0.1 },
    defeated: false,
  },
  {
    id: 'boss_gym',
    name: 'Gym Goblin',
    icon: '💪',
    type: 'subscription',
    totalHP: 29.99,
    currentHP: 29.99,
    dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    reward: { xp: 50, gems: 3, lootChance: 0.15 },
    defeated: false,
  },
];

const INITIAL_DUNGEONS: Dungeon[] = DUNGEON_TEMPLATES.map(template => ({
  ...template,
  totalBudget: template.difficulty === 'easy' ? 100 : 
               template.difficulty === 'medium' ? 200 : 
               template.difficulty === 'hard' ? 300 : 400,
  spent: Math.random() * 100,
  monstersDefeated: Math.floor(Math.random() * 5),
  conquered: false,
}));

export function useGameState() {
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'expense', amount: 45.99, category: 'food', description: 'Groceries', date: new Date() },
    { id: '2', type: 'expense', amount: 12.50, category: 'transport', description: 'Uber ride', date: new Date() },
    { id: '3', type: 'income', amount: 200, category: 'income', description: 'Freelance gig', date: new Date() },
  ]);
  const [inventory, setInventory] = useState<LootItem[]>([
    LOOT_POOL[0],
    LOOT_POOL[4],
  ]);
  const [bosses, setBosses] = useState<Boss[]>(INITIAL_BOSSES);
  const [dungeons, setDungeons] = useState<Dungeon[]>(INITIAL_DUNGEONS);
  const [equippedAccessories, setEquippedAccessories] = useState<{
    hat?: AvatarAccessory;
    weapon?: AvatarAccessory;
    aura?: AvatarAccessory;
    pet?: AvatarAccessory;
  }>({});

  const calculateHP = useCallback((balance: number, limit: number): number => {
    return Math.max(0, Math.min(100, Math.round((balance / limit) * 100)));
  }, []);

  const calculateXPForSaving = useCallback((amount: number): number => {
    return Math.floor(amount * 2);
  }, []);

  const getLevelFromXP = useCallback((xp: number): number => {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
    }
    return 1;
  }, []);

  const getXPProgress = useCallback((xp: number, level: number): number => {
    const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  }, []);

  const addExpense = useCallback((amount: number, category: string, description: string) => {
    const newBalance = stats.currentBalance - amount;
    const newHP = calculateHP(newBalance, stats.monthlyLimit);
    
    setStats(prev => ({
      ...prev,
      currentBalance: newBalance,
      hp: newHP,
    }));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'expense',
      amount,
      category,
      description,
      date: new Date(),
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Update dungeon progress
    setDungeons(prev => prev.map(dungeon => {
      if (dungeon.category === category) {
        const newSpent = dungeon.spent + amount;
        return {
          ...dungeon,
          spent: newSpent,
          monstersDefeated: dungeon.monstersDefeated + 1,
          conquered: newSpent >= dungeon.totalBudget,
        };
      }
      return dungeon;
    }));
  }, [stats, calculateHP]);

  const addIncome = useCallback((amount: number, description: string) => {
    const newBalance = stats.currentBalance + amount;
    const newHP = calculateHP(newBalance, stats.monthlyLimit);
    const xpGained = calculateXPForSaving(amount);
    const newXP = stats.xp + xpGained;
    const newLevel = getLevelFromXP(newXP);
    
    setStats(prev => ({
      ...prev,
      currentBalance: newBalance,
      hp: newHP,
      xp: newXP,
      level: newLevel,
      totalSaved: prev.totalSaved + amount,
    }));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'income',
      amount,
      category: 'income',
      description,
      date: new Date(),
    };

    setTransactions(prev => [newTransaction, ...prev]);

    return { xpGained, levelUp: newLevel > stats.level };
  }, [stats, calculateHP, calculateXPForSaving, getLevelFromXP]);

  const openLootBox = useCallback((): LootBoxResult => {
    const roll = Math.random();
    let rarity: 'common' | 'rare' | 'legendary';
    
    if (roll < 0.60) rarity = 'common';
    else if (roll < 0.90) rarity = 'rare';
    else rarity = 'legendary';

    const itemsOfRarity = LOOT_POOL.filter(item => item.rarity === rarity);
    const randomItem = itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
    
    const isNew = !inventory.some(item => item.id === randomItem.id);
    
    if (isNew) {
      setInventory(prev => [...prev, { ...randomItem, unlockedAt: new Date() }]);
    }

    return { item: randomItem, isNew };
  }, [inventory]);

  const claimNoSpendDay = useCallback(() => {
    const xpGained = 50;
    const newXP = stats.xp + xpGained;
    const newLevel = getLevelFromXP(newXP);
    const newStreak = stats.streakDays + 1;
    
    setStats(prev => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      streakDays: newStreak,
    }));

    return {
      xpGained,
      levelUp: newLevel > stats.level,
      lootBox: openLootBox(),
    };
  }, [stats, getLevelFromXP, openLootBox]);

  const defeatBoss = useCallback((bossId: string, amount: number) => {
    const boss = bosses.find(b => b.id === bossId);
    if (!boss || boss.defeated) return;

    // Deduct balance
    const newBalance = stats.currentBalance - amount;
    const newHP = calculateHP(newBalance, stats.monthlyLimit);
    
    // Add XP and gems from reward
    const newXP = stats.xp + boss.reward.xp;
    const newLevel = getLevelFromXP(newXP);
    const newGems = stats.gems + boss.reward.gems;

    setStats(prev => ({
      ...prev,
      currentBalance: newBalance,
      hp: newHP,
      xp: newXP,
      level: newLevel,
      gems: newGems,
    }));

    // Mark boss as defeated
    setBosses(prev => prev.map(b => 
      b.id === bossId ? { ...b, defeated: true, currentHP: 0 } : b
    ));

    // Add transaction
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'expense',
      amount,
      category: 'bills',
      description: `Defeated ${boss.name}`,
      date: new Date(),
    };

    setTransactions(prev => [newTransaction, ...prev]);

    // Chance for loot
    if (Math.random() < boss.reward.lootChance) {
      return { ...openLootBox(), bossDefeated: true };
    }

    return { bossDefeated: true };
  }, [stats, bosses, calculateHP, getLevelFromXP, openLootBox]);

  const equipAccessory = useCallback((accessory: AvatarAccessory) => {
    setEquippedAccessories(prev => {
      // If already equipped, unequip
      if (prev[accessory.slot]?.id === accessory.id) {
        const newState = { ...prev };
        delete newState[accessory.slot];
        return newState;
      }
      // Equip new accessory
      return {
        ...prev,
        [accessory.slot]: accessory,
      };
    });
  }, []);

  return {
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
  };
}