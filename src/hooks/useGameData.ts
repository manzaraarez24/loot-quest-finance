import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  LootItem,
  LootBoxResult,
  AvatarAccessory,
  LEVEL_THRESHOLDS,
  LOOT_POOL,
  DUNGEON_TEMPLATES,
} from '@/types/game';

interface UserStats {
  balance: number;
  monthlyLimit: number;
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  gems: number;
  noSpendStreak: number;
}

interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string | null;
  description: string;
  createdAt: Date;
}

interface Boss {
  id: string;
  bossId: string;
  name: string;
  currentHp: number;
  maxHp: number;
  cost: number;
  xpReward: number;
  gemReward: number;
  dueDate: Date | null;
  isDefeated: boolean;
}

interface Dungeon {
  id: string;
  dungeonId: string;
  name: string;
  category: string;
  budget: number;
  spent: number;
  monstersDefeated: number;
  totalMonsters: number;
  isCompleted: boolean;
}

interface InventoryItem {
  id: string;
  itemId: string;
  name: string;
  type: string;
  rarity: string;
  description: string | null;
  icon: string | null;
}

const DEFAULT_STATS: UserStats = {
  balance: 1000,
  monthlyLimit: 2000,
  hp: 100,
  maxHp: 100,
  xp: 0,
  level: 1,
  gems: 0,
  noSpendStreak: 0,
};

export function useGameData() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [dungeons, setDungeons] = useState<Dungeon[]>([]);
  const [equippedAccessories, setEquippedAccessories] = useState<{
    hat?: AvatarAccessory;
    weapon?: AvatarAccessory;
    aura?: AvatarAccessory;
    pet?: AvatarAccessory;
  }>({});

  // Load user data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const loadData = async () => {
      setLoading(true);
      try {
        // Load stats
        const { data: statsData } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (statsData) {
          setStats({
            balance: Number(statsData.balance),
            monthlyLimit: Number(statsData.monthly_limit),
            hp: statsData.hp,
            maxHp: statsData.max_hp,
            xp: statsData.xp,
            level: statsData.level,
            gems: statsData.gems,
            noSpendStreak: statsData.no_spend_streak,
          });
        }

        // Load transactions
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (transactionsData) {
          setTransactions(transactionsData.map(t => ({
            id: t.id,
            type: t.type as 'expense' | 'income',
            amount: Number(t.amount),
            category: t.category,
            description: t.description,
            createdAt: new Date(t.created_at),
          })));
        }

        // Load inventory
        const { data: inventoryData } = await supabase
          .from('inventory')
          .select('*')
          .eq('user_id', user.id);
        
        if (inventoryData) {
          setInventory(inventoryData.map(i => ({
            id: i.id,
            itemId: i.item_id,
            name: i.item_name,
            type: i.item_type,
            rarity: i.item_rarity,
            description: i.item_description,
            icon: i.item_icon,
          })));
        }

        // Load bosses
        const { data: bossesData } = await supabase
          .from('user_bosses')
          .select('*')
          .eq('user_id', user.id);
        
        if (bossesData && bossesData.length > 0) {
          setBosses(bossesData.map(b => ({
            id: b.id,
            bossId: b.boss_id,
            name: b.boss_name,
            currentHp: b.current_hp,
            maxHp: b.max_hp,
            cost: Number(b.cost),
            xpReward: b.xp_reward,
            gemReward: b.gem_reward,
            dueDate: b.due_date ? new Date(b.due_date) : null,
            isDefeated: b.is_defeated,
          })));
        } else {
          // Initialize default bosses
          await initializeDefaultBosses();
        }

        // Load dungeons
        const { data: dungeonsData } = await supabase
          .from('user_dungeons')
          .select('*')
          .eq('user_id', user.id);
        
        if (dungeonsData && dungeonsData.length > 0) {
          setDungeons(dungeonsData.map(d => ({
            id: d.id,
            dungeonId: d.dungeon_id,
            name: d.dungeon_name,
            category: d.category,
            budget: Number(d.budget),
            spent: Number(d.spent),
            monstersDefeated: d.monsters_defeated,
            totalMonsters: d.total_monsters,
            isCompleted: d.is_completed,
          })));
        } else {
          // Initialize default dungeons
          await initializeDefaultDungeons();
        }

        // Load equipped accessories
        const { data: accessoriesData } = await supabase
          .from('equipped_accessories')
          .select('*')
          .eq('user_id', user.id);
        
        if (accessoriesData) {
          const equipped: typeof equippedAccessories = {};
          accessoriesData.forEach(a => {
            const accessoryType = a.accessory_type as 'hat' | 'weapon' | 'aura' | 'pet';
            equipped[accessoryType] = {
              id: a.accessory_id,
              name: a.accessory_id,
              icon: '',
              slot: accessoryType,
              rarity: 'common',
              unlockLevel: 1,
            };
          });
          setEquippedAccessories(equipped);
        }

      } catch (error) {
        console.error('Error loading game data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const initializeDefaultBosses = async () => {
    if (!user) return;
    
    const defaultBosses = [
      { boss_id: 'boss_rent', boss_name: 'Landlord Dragon', current_hp: 1200, max_hp: 1200, cost: 1200, xp_reward: 200, gem_reward: 10, due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { boss_id: 'boss_netflix', boss_name: 'Streaming Specter', current_hp: 16, max_hp: 16, cost: 16, xp_reward: 30, gem_reward: 2, due_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { boss_id: 'boss_gym', boss_name: 'Gym Goblin', current_hp: 30, max_hp: 30, cost: 30, xp_reward: 50, gem_reward: 3, due_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    ];

    const { data } = await supabase
      .from('user_bosses')
      .insert(defaultBosses.map(b => ({ ...b, user_id: user.id })))
      .select();
    
    if (data) {
      setBosses(data.map(b => ({
        id: b.id,
        bossId: b.boss_id,
        name: b.boss_name,
        currentHp: b.current_hp,
        maxHp: b.max_hp,
        cost: Number(b.cost),
        xpReward: b.xp_reward,
        gemReward: b.gem_reward,
        dueDate: b.due_date ? new Date(b.due_date) : null,
        isDefeated: b.is_defeated,
      })));
    }
  };

  const initializeDefaultDungeons = async () => {
    if (!user) return;
    
    const defaultDungeons = DUNGEON_TEMPLATES.map(template => ({
      dungeon_id: template.id,
      dungeon_name: template.name,
      category: template.category,
      budget: template.difficulty === 'easy' ? 100 : template.difficulty === 'medium' ? 200 : template.difficulty === 'hard' ? 300 : 400,
      spent: 0,
      monsters_defeated: 0,
      total_monsters: template.totalMonsters,
      is_completed: false,
      user_id: user.id,
    }));

    const { data } = await supabase
      .from('user_dungeons')
      .insert(defaultDungeons)
      .select();
    
    if (data) {
      setDungeons(data.map(d => ({
        id: d.id,
        dungeonId: d.dungeon_id,
        name: d.dungeon_name,
        category: d.category,
        budget: Number(d.budget),
        spent: Number(d.spent),
        monstersDefeated: d.monsters_defeated,
        totalMonsters: d.total_monsters,
        isCompleted: d.is_completed,
      })));
    }
  };

  // Helper functions
  const calculateHP = useCallback((balance: number, limit: number): number => {
    return Math.max(0, Math.min(100, Math.round((balance / limit) * 100)));
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

  // Actions
  const addExpense = useCallback(async (amount: number, category: string, description: string) => {
    if (!user) return;

    const newBalance = stats.balance - amount;
    const newHP = calculateHP(newBalance, stats.monthlyLimit);

    // Update stats in DB
    await supabase
      .from('user_stats')
      .update({ balance: newBalance, hp: newHP })
      .eq('user_id', user.id);

    // Insert transaction
    const { data: txData } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'expense',
        amount,
        category,
        description,
      })
      .select()
      .single();

    setStats(prev => ({ ...prev, balance: newBalance, hp: newHP }));
    
    if (txData) {
      setTransactions(prev => [{
        id: txData.id,
        type: 'expense',
        amount: Number(txData.amount),
        category: txData.category,
        description: txData.description,
        createdAt: new Date(txData.created_at),
      }, ...prev]);
    }

    // Update dungeon progress
    const dungeon = dungeons.find(d => d.category === category);
    if (dungeon) {
      const newSpent = dungeon.spent + amount;
      const newMonstersDefeated = dungeon.monstersDefeated + 1;
      
      await supabase
        .from('user_dungeons')
        .update({ 
          spent: newSpent, 
          monsters_defeated: newMonstersDefeated,
          is_completed: newSpent >= dungeon.budget,
        })
        .eq('id', dungeon.id);

      setDungeons(prev => prev.map(d => 
        d.id === dungeon.id 
          ? { ...d, spent: newSpent, monstersDefeated: newMonstersDefeated, isCompleted: newSpent >= dungeon.budget }
          : d
      ));
    }
  }, [user, stats, dungeons, calculateHP]);

  const addIncome = useCallback(async (amount: number, description: string) => {
    if (!user) return { xpGained: 0, levelUp: false };

    const newBalance = stats.balance + amount;
    const newHP = calculateHP(newBalance, stats.monthlyLimit);
    const xpGained = Math.floor(amount * 2);
    const newXP = stats.xp + xpGained;
    const newLevel = getLevelFromXP(newXP);

    // Update stats in DB
    await supabase
      .from('user_stats')
      .update({ 
        balance: newBalance, 
        hp: newHP,
        xp: newXP,
        level: newLevel,
      })
      .eq('user_id', user.id);

    // Insert transaction
    const { data: txData } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'income',
        amount,
        category: 'income',
        description,
      })
      .select()
      .single();

    const levelUp = newLevel > stats.level;
    
    setStats(prev => ({ 
      ...prev, 
      balance: newBalance, 
      hp: newHP, 
      xp: newXP, 
      level: newLevel,
    }));
    
    if (txData) {
      setTransactions(prev => [{
        id: txData.id,
        type: 'income',
        amount: Number(txData.amount),
        category: txData.category,
        description: txData.description,
        createdAt: new Date(txData.created_at),
      }, ...prev]);
    }

    if (levelUp) {
      toast({
        title: '🎉 Level Up!',
        description: `You've reached level ${newLevel}!`,
      });
    }

    return { xpGained, levelUp };
  }, [user, stats, calculateHP, getLevelFromXP, toast]);

  const openLootBox = useCallback(async (): Promise<LootBoxResult> => {
    const roll = Math.random();
    let rarity: 'common' | 'rare' | 'legendary';
    
    if (roll < 0.60) rarity = 'common';
    else if (roll < 0.90) rarity = 'rare';
    else rarity = 'legendary';

    const itemsOfRarity = LOOT_POOL.filter(item => item.rarity === rarity);
    const randomItem = itemsOfRarity[Math.floor(Math.random() * itemsOfRarity.length)];
    
    const isNew = !inventory.some(item => item.itemId === randomItem.id);
    
    if (isNew && user) {
      const { data } = await supabase
        .from('inventory')
        .insert({
          user_id: user.id,
          item_id: randomItem.id,
          item_name: randomItem.name,
          item_type: randomItem.type,
          item_rarity: randomItem.rarity,
          item_description: randomItem.description,
          item_icon: randomItem.icon,
        })
        .select()
        .single();

      if (data) {
        setInventory(prev => [...prev, {
          id: data.id,
          itemId: data.item_id,
          name: data.item_name,
          type: data.item_type,
          rarity: data.item_rarity,
          description: data.item_description,
          icon: data.item_icon,
        }]);
      }
    }

    return { item: randomItem, isNew };
  }, [user, inventory]);

  const claimNoSpendDay = useCallback(async () => {
    if (!user) return { xpGained: 0, levelUp: false, lootBox: { item: LOOT_POOL[0], isNew: false } };

    const xpGained = 50;
    const newXP = stats.xp + xpGained;
    const newLevel = getLevelFromXP(newXP);
    const newStreak = stats.noSpendStreak + 1;

    await supabase
      .from('user_stats')
      .update({ 
        xp: newXP, 
        level: newLevel, 
        no_spend_streak: newStreak,
      })
      .eq('user_id', user.id);

    const levelUp = newLevel > stats.level;
    
    setStats(prev => ({ 
      ...prev, 
      xp: newXP, 
      level: newLevel, 
      noSpendStreak: newStreak,
    }));

    const lootBox = await openLootBox();

    return { xpGained, levelUp, lootBox };
  }, [user, stats, getLevelFromXP, openLootBox]);

  const defeatBoss = useCallback(async (bossId: string, amount: number) => {
    if (!user) return;

    const boss = bosses.find(b => b.bossId === bossId);
    if (!boss || boss.isDefeated) return;

    const newBalance = stats.balance - amount;
    const newHP = calculateHP(newBalance, stats.monthlyLimit);
    const newXP = stats.xp + boss.xpReward;
    const newLevel = getLevelFromXP(newXP);
    const newGems = stats.gems + boss.gemReward;

    // Update stats
    await supabase
      .from('user_stats')
      .update({ 
        balance: newBalance, 
        hp: newHP, 
        xp: newXP, 
        level: newLevel, 
        gems: newGems,
      })
      .eq('user_id', user.id);

    // Mark boss defeated
    await supabase
      .from('user_bosses')
      .update({ is_defeated: true, current_hp: 0, defeated_at: new Date().toISOString() })
      .eq('id', boss.id);

    // Insert transaction
    await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'expense',
        amount,
        category: 'bills',
        description: `Defeated ${boss.name}`,
      });

    setStats(prev => ({ 
      ...prev, 
      balance: newBalance, 
      hp: newHP, 
      xp: newXP, 
      level: newLevel, 
      gems: newGems,
    }));

    setBosses(prev => prev.map(b => 
      b.id === boss.id ? { ...b, isDefeated: true, currentHp: 0 } : b
    ));

    toast({
      title: `⚔️ ${boss.name} Defeated!`,
      description: `+${boss.xpReward} XP, +${boss.gemReward} Gems`,
    });

    // Chance for loot
    if (Math.random() < 0.3) {
      const loot = await openLootBox();
      return { ...loot, bossDefeated: true };
    }

    return { bossDefeated: true };
  }, [user, stats, bosses, calculateHP, getLevelFromXP, openLootBox, toast]);

  const equipAccessory = useCallback(async (accessory: AvatarAccessory) => {
    if (!user) return;

    const currentlyEquipped = equippedAccessories[accessory.slot];
    
    if (currentlyEquipped?.id === accessory.id) {
      // Unequip
      await supabase
        .from('equipped_accessories')
        .delete()
        .eq('user_id', user.id)
        .eq('accessory_type', accessory.slot);

      setEquippedAccessories(prev => {
        const newState = { ...prev };
        delete newState[accessory.slot];
        return newState;
      });
    } else {
      // Equip
      await supabase
        .from('equipped_accessories')
        .upsert({
          user_id: user.id,
          accessory_type: accessory.slot,
          accessory_id: accessory.id,
        }, { onConflict: 'user_id,accessory_type' });

      setEquippedAccessories(prev => ({
        ...prev,
        [accessory.slot]: accessory,
      }));
    }
  }, [user, equippedAccessories]);

  const updateBudget = useCallback(async (newBudget: number) => {
    if (!user) return;

    const newHP = calculateHP(stats.balance, newBudget);

    await supabase
      .from('user_stats')
      .update({ monthly_limit: newBudget, hp: newHP })
      .eq('user_id', user.id);

    setStats(prev => ({ ...prev, monthlyLimit: newBudget, hp: newHP }));

    toast({
      title: '💰 Budget Updated',
      description: `Your monthly budget is now $${newBudget.toLocaleString()}`,
    });
  }, [user, stats.balance, calculateHP, toast]);

  // Convert to format expected by components
  const formattedStats = {
    currentBalance: stats.balance,
    monthlyLimit: stats.monthlyLimit,
    hp: stats.hp,
    xp: stats.xp,
    level: stats.level,
    streakDays: stats.noSpendStreak,
    totalSaved: 0,
    gems: stats.gems,
  };

  const formattedTransactions = transactions.map(t => ({
    id: t.id,
    type: t.type,
    amount: t.amount,
    category: t.category || 'other',
    description: t.description,
    date: t.createdAt,
  }));

  const formattedBosses = bosses.map(b => ({
    id: b.bossId,
    name: b.name,
    icon: b.bossId === 'boss_rent' ? '🏠' : b.bossId === 'boss_netflix' ? '📺' : '💪',
    type: 'bill' as const,
    totalHP: b.maxHp,
    currentHP: b.currentHp,
    dueDate: b.dueDate || new Date(),
    reward: { xp: b.xpReward, gems: b.gemReward, lootChance: 0.3 },
    defeated: b.isDefeated,
  }));

  const formattedDungeons = dungeons.map(d => ({
    id: d.dungeonId,
    name: d.name,
    icon: d.category === 'food' ? '🍔' : d.category === 'transport' ? '🚗' : d.category === 'entertainment' ? '🎮' : d.category === 'shopping' ? '🛍️' : '📄',
    category: d.category,
    difficulty: 'medium' as const,
    totalBudget: d.budget,
    spent: d.spent,
    totalMonsters: d.totalMonsters,
    monstersDefeated: d.monstersDefeated,
    conquered: d.isCompleted,
  }));

  const formattedInventory = inventory.map(i => ({
    id: i.itemId,
    name: i.name,
    type: i.type as 'badge' | 'title' | 'avatar' | 'boost',
    rarity: i.rarity as 'common' | 'rare' | 'legendary',
    description: i.description || '',
    icon: i.icon || '🎁',
  }));

  return {
    loading,
    stats: formattedStats,
    transactions: formattedTransactions,
    inventory: formattedInventory,
    bosses: formattedBosses,
    dungeons: formattedDungeons,
    equippedAccessories,
    addExpense,
    addIncome,
    openLootBox,
    claimNoSpendDay,
    getXPProgress,
    defeatBoss,
    equipAccessory,
    updateBudget,
  };
}
