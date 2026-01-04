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
  type: 'avatar' | 'badge' | 'theme' | 'title';
  icon: string;
  description: string;
  unlockedAt?: Date;
}

export interface LootBoxResult {
  item: LootItem;
  isNew: boolean;
}

export type AvatarMood = 'ecstatic' | 'happy' | 'neutral' | 'worried' | 'critical';

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5500, 8000, 12000
];

export const LOOT_POOL: LootItem[] = [
  // Common items (60%)
  { id: 'badge_saver', name: 'Penny Pincher', rarity: 'common', type: 'badge', icon: '🪙', description: 'Your first steps to savings' },
  { id: 'badge_streak3', name: '3-Day Warrior', rarity: 'common', type: 'badge', icon: '🔥', description: 'Maintained a 3-day streak' },
  { id: 'title_rookie', name: 'Budget Rookie', rarity: 'common', type: 'title', icon: '🎮', description: 'A title for beginners' },
  { id: 'avatar_smile', name: 'Happy Spender', rarity: 'common', type: 'avatar', icon: '😊', description: 'Default happy avatar' },
  { id: 'badge_firstwin', name: 'First Victory', rarity: 'common', type: 'badge', icon: '⭐', description: 'Won your first loot box' },
  
  // Rare items (30%)
  { id: 'theme_cyber', name: 'Cyber Theme', rarity: 'rare', type: 'theme', icon: '💜', description: 'Purple cyberpunk vibes' },
  { id: 'badge_streak7', name: 'Week Warrior', rarity: 'rare', type: 'badge', icon: '💎', description: '7-day streak achieved!' },
  { id: 'title_saver', name: 'Money Master', rarity: 'rare', type: 'title', icon: '👑', description: 'A prestigious title' },
  { id: 'avatar_cool', name: 'Cool Cat', rarity: 'rare', type: 'avatar', icon: '😎', description: 'Stylish avatar unlock' },
  
  // Legendary items (10%)
  { id: 'theme_gold', name: 'Golden Era', rarity: 'legendary', type: 'theme', icon: '✨', description: 'Legendary gold theme' },
  { id: 'title_legend', name: 'Budget Legend', rarity: 'legendary', type: 'title', icon: '🏆', description: 'The ultimate title' },
  { id: 'avatar_dragon', name: 'Dragon Lord', rarity: 'legendary', type: 'avatar', icon: '🐉', description: 'Mythical avatar unlock' },
];

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Drinks', icon: '🍔', color: 'neon-orange' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'neon-cyan' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: 'neon-pink' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'neon-purple' },
  { id: 'bills', name: 'Bills', icon: '📄', color: 'neon-green' },
  { id: 'other', name: 'Other', icon: '📦', color: 'muted' },
];
