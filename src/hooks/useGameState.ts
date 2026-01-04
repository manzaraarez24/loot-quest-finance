import { useState, useCallback } from 'react';
import { UserStats, Transaction, LootItem, LootBoxResult, LEVEL_THRESHOLDS, LOOT_POOL } from '@/types/game';

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

  return {
    stats,
    transactions,
    inventory,
    addExpense,
    addIncome,
    openLootBox,
    claimNoSpendDay,
    getXPProgress,
  };
}
