export interface UserStats {
  currentBalance: number;
  monthlyLimit: number;
  hp: number;
  xp: number;
  level: number;
  streakDays: number;
  totalSaved: number;
  gems: number;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

export interface LootItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'legendary';
  type: 'avatar' | 'badge' | 'theme' | 'title' | 'accessory';
  icon: string;
  description: string;
  unlockedAt?: Date;
}

export interface LootBoxResult {
  item: LootItem;
  isNew: boolean;
}

export type AvatarMood = 'ecstatic' | 'happy' | 'neutral' | 'worried' | 'critical';

// Avatar Evolution System
export type AvatarStage = 'egg' | 'hatchling' | 'warrior' | 'champion' | 'legend' | 'mythic';

export interface AvatarAccessory {
  id: string;
  name: string;
  slot: 'hat' | 'weapon' | 'aura' | 'pet';
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
  unlockLevel: number;
}

export interface AvatarState {
  stage: AvatarStage;
  equippedAccessories: {
    hat?: AvatarAccessory;
    weapon?: AvatarAccessory;
    aura?: AvatarAccessory;
    pet?: AvatarAccessory;
  };
}

// Spending Persona System
export interface SpendingPersona {
  id: string;
  name: string;
  title: string;
  icon: string;
  description: string;
  traits: string[];
  dominantCategory: string;
  rarity: 'common' | 'rare' | 'legendary';
}

// Boss Fight System
export interface Boss {
  id: string;
  name: string;
  icon: string;
  type: 'bill' | 'subscription' | 'debt';
  totalHP: number;
  currentHP: number;
  dueDate: Date;
  reward: {
    xp: number;
    gems: number;
    lootChance: number;
  };
  defeated: boolean;
}

// Dungeon System
export interface Dungeon {
  id: string;
  name: string;
  icon: string;
  category: string;
  totalBudget: number;
  spent: number;
  monstersDefeated: number;
  totalMonsters: number;
  conquered: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'nightmare';
}

// Prophecy System
export interface SpendingProphecy {
  predictedEndBalance: number;
  confidence: number;
  trend: 'improving' | 'stable' | 'declining' | 'critical';
  message: string;
  recommendations: string[];
}

// Regret Calculator
export interface RegretCalculation {
  originalAmount: number;
  yearsInvested: number;
  projectedValue: number;
  alternativeUses: {
    item: string;
    icon: string;
    quantity: number;
  }[];
}

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000
];

// Avatar Evolution Stages
export const AVATAR_STAGES: Record<AvatarStage, { minLevel: number; icon: string; name: string }> = {
  egg: { minLevel: 1, icon: '🥚', name: 'Mysterious Egg' },
  hatchling: { minLevel: 2, icon: '🐣', name: 'Budget Hatchling' },
  warrior: { minLevel: 4, icon: '⚔️', name: 'Savings Warrior' },
  champion: { minLevel: 6, icon: '🛡️', name: 'Finance Champion' },
  legend: { minLevel: 8, icon: '👑', name: 'Wealth Legend' },
  mythic: { minLevel: 10, icon: '🐉', name: 'Mythic Dragon' },
};

// Available Accessories
export const AVATAR_ACCESSORIES: AvatarAccessory[] = [
  // Hats
  { id: 'hat_basic', name: 'Penny Cap', slot: 'hat', icon: '🧢', rarity: 'common', unlockLevel: 1 },
  { id: 'hat_crown', name: 'Golden Crown', slot: 'hat', icon: '👑', rarity: 'legendary', unlockLevel: 8 },
  { id: 'hat_wizard', name: 'Finance Wizard Hat', slot: 'hat', icon: '🎩', rarity: 'rare', unlockLevel: 5 },
  { id: 'hat_helmet', name: 'Battle Helmet', slot: 'hat', icon: '⛑️', rarity: 'rare', unlockLevel: 4 },
  
  // Weapons
  { id: 'weapon_sword', name: 'Budget Blade', slot: 'weapon', icon: '⚔️', rarity: 'common', unlockLevel: 2 },
  { id: 'weapon_staff', name: 'Savings Staff', slot: 'weapon', icon: '🪄', rarity: 'rare', unlockLevel: 5 },
  { id: 'weapon_hammer', name: 'Debt Crusher', slot: 'weapon', icon: '🔨', rarity: 'legendary', unlockLevel: 9 },
  
  // Auras
  { id: 'aura_spark', name: 'Spark Aura', slot: 'aura', icon: '✨', rarity: 'common', unlockLevel: 1 },
  { id: 'aura_fire', name: 'Flame Aura', slot: 'aura', icon: '🔥', rarity: 'rare', unlockLevel: 6 },
  { id: 'aura_rainbow', name: 'Rainbow Aura', slot: 'aura', icon: '🌈', rarity: 'legendary', unlockLevel: 10 },
  
  // Pets
  { id: 'pet_coin', name: 'Coin Companion', slot: 'pet', icon: '🪙', rarity: 'common', unlockLevel: 1 },
  { id: 'pet_cat', name: 'Lucky Cat', slot: 'pet', icon: '🐱', rarity: 'rare', unlockLevel: 4 },
  { id: 'pet_dragon', name: 'Treasure Dragon', slot: 'pet', icon: '🐲', rarity: 'legendary', unlockLevel: 8 },
];

// Spending Personas
export const SPENDING_PERSONAS: SpendingPersona[] = [
  {
    id: 'coffee_goblin',
    name: 'Coffee Goblin',
    title: 'Caffeine Commander',
    icon: '☕',
    description: 'Your coffee runs on a subscription model',
    traits: ['Early riser', 'Triple shot enthusiast', 'Barista BFF'],
    dominantCategory: 'food',
    rarity: 'common',
  },
  {
    id: 'subscription_sorcerer',
    name: 'Subscription Sorcerer',
    title: 'Master of Monthly Payments',
    icon: '🧙',
    description: 'You have more subscriptions than spells',
    traits: ['Streaming addict', 'App collector', 'Free trial expert'],
    dominantCategory: 'entertainment',
    rarity: 'rare',
  },
  {
    id: 'uber_unicorn',
    name: 'Uber Unicorn',
    title: 'Ride or Die',
    icon: '🦄',
    description: 'Walking is for peasants',
    traits: ['Surge pricing survivor', 'Rating perfectionist', 'Tip maximizer'],
    dominantCategory: 'transport',
    rarity: 'common',
  },
  {
    id: 'retail_dragon',
    name: 'Retail Dragon',
    title: 'Hoarder of Treasures',
    icon: '🐉',
    description: 'Your cart is always full, your wallet always empty',
    traits: ['Sale hunter', 'Wishlist warrior', 'Next-day delivery VIP'],
    dominantCategory: 'shopping',
    rarity: 'legendary',
  },
  {
    id: 'savings_sage',
    name: 'Savings Sage',
    title: 'Master of Restraint',
    icon: '🧘',
    description: 'Patience is your superpower',
    traits: ['Coupon clipper', 'Generic brand advocate', 'Investment guru'],
    dominantCategory: 'income',
    rarity: 'legendary',
  },
  {
    id: 'foodie_phoenix',
    name: 'Foodie Phoenix',
    title: 'Delivery Devotee',
    icon: '🍕',
    description: 'Your kitchen is purely decorative',
    traits: ['Menu memorizer', 'Review writer', 'Extra sauce requester'],
    dominantCategory: 'food',
    rarity: 'rare',
  },
  {
    id: 'bill_battler',
    name: 'Bill Battler',
    title: 'Responsibility Ranger',
    icon: '📋',
    description: 'You pay bills like a boss',
    traits: ['Auto-pay expert', 'Due date tracker', 'Credit score guardian'],
    dominantCategory: 'bills',
    rarity: 'rare',
  },
  {
    id: 'mystery_merchant',
    name: 'Mystery Merchant',
    title: 'Chaos Spender',
    icon: '🎭',
    description: 'Even you don\'t know where your money goes',
    traits: ['Impulsive buyer', 'Category defier', 'Receipt hoarder'],
    dominantCategory: 'other',
    rarity: 'common',
  },
];

export const LOOT_POOL: LootItem[] = [
  // Common items (60%)
  { id: 'badge_saver', name: 'Penny Pincher', rarity: 'common', type: 'badge', icon: '🪙', description: 'Your first steps to savings' },
  { id: 'badge_streak3', name: '3-Day Warrior', rarity: 'common', type: 'badge', icon: '🔥', description: 'Maintained a 3-day streak' },
  { id: 'title_rookie', name: 'Budget Rookie', rarity: 'common', type: 'title', icon: '🎮', description: 'A title for beginners' },
  { id: 'avatar_smile', name: 'Happy Spender', rarity: 'common', type: 'avatar', icon: '😊', description: 'Default happy avatar' },
  { id: 'badge_firstwin', name: 'First Victory', rarity: 'common', type: 'badge', icon: '⭐', description: 'Won your first loot box' },
  { id: 'accessory_hat_basic', name: 'Penny Cap', rarity: 'common', type: 'accessory', icon: '🧢', description: 'A humble beginning' },
  
  // Rare items (30%)
  { id: 'theme_cyber', name: 'Cyber Theme', rarity: 'rare', type: 'theme', icon: '💜', description: 'Purple cyberpunk vibes' },
  { id: 'badge_streak7', name: 'Week Warrior', rarity: 'rare', type: 'badge', icon: '💎', description: '7-day streak achieved!' },
  { id: 'title_saver', name: 'Money Master', rarity: 'rare', type: 'title', icon: '👑', description: 'A prestigious title' },
  { id: 'avatar_cool', name: 'Cool Cat', rarity: 'rare', type: 'avatar', icon: '😎', description: 'Stylish avatar unlock' },
  { id: 'accessory_weapon_staff', name: 'Savings Staff', rarity: 'rare', type: 'accessory', icon: '🪄', description: 'Channel your inner wizard' },
  
  // Legendary items (10%)
  { id: 'theme_gold', name: 'Golden Era', rarity: 'legendary', type: 'theme', icon: '✨', description: 'Legendary gold theme' },
  { id: 'title_legend', name: 'Budget Legend', rarity: 'legendary', type: 'title', icon: '🏆', description: 'The ultimate title' },
  { id: 'avatar_dragon', name: 'Dragon Lord', rarity: 'legendary', type: 'avatar', icon: '🐉', description: 'Mythical avatar unlock' },
  { id: 'accessory_pet_dragon', name: 'Treasure Dragon', rarity: 'legendary', type: 'accessory', icon: '🐲', description: 'Your loyal companion' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', icon: '🍔', color: 'neon-orange' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'neon-cyan' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: 'neon-pink' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'neon-purple' },
  { id: 'bills', name: 'Bills', icon: '📄', color: 'neon-green' },
  { id: 'other', name: 'Other', icon: '📦', color: 'muted' },
];

// Dungeon templates based on expense categories
export const DUNGEON_TEMPLATES = [
  { id: 'food_dungeon', name: 'Tavern of Temptation', icon: '🍔', category: 'food', difficulty: 'medium' as const, totalMonsters: 10 },
  { id: 'transport_dungeon', name: 'Road of Ruin', icon: '🚗', category: 'transport', difficulty: 'easy' as const, totalMonsters: 5 },
  { id: 'entertainment_dungeon', name: 'Arcade Abyss', icon: '🎮', category: 'entertainment', difficulty: 'hard' as const, totalMonsters: 15 },
  { id: 'shopping_dungeon', name: 'Mall of Madness', icon: '🛍️', category: 'shopping', difficulty: 'nightmare' as const, totalMonsters: 20 },
  { id: 'bills_dungeon', name: 'Tower of Payments', icon: '📄', category: 'bills', difficulty: 'medium' as const, totalMonsters: 8 },
];