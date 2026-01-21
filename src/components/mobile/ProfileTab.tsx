import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { LogOut, Shield, User, Package, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileTabProps {
  email: string;
  stats: {
    level: number;
    xp: number;
    gems: number;
    streakDays: number;
  };
  inventoryCount: number;
  onSignOut: () => void;
}

export function ProfileTab({ email, stats, inventoryCount, onSignOut }: ProfileTabProps) {
  const username = email.split('@')[0];

  return (
    <div className="space-y-4 pb-24">
      {/* Profile Header */}
      <GlassCard
        glow="purple"
        className="p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-xl font-bold text-foreground">{username}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded-full font-medium">
                Level {stats.level}
              </span>
              <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-0.5 rounded-full font-medium">
                {stats.gems} Gems
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Overview */}
      <GlassCard
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Your Stats
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <span className="text-3xl block mb-1">⚡</span>
            <p className="font-display text-xl font-bold text-foreground">{stats.xp.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 text-center">
            <span className="text-3xl block mb-1">🔥</span>
            <p className="font-display text-xl font-bold text-foreground">{stats.streakDays}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
        </div>
      </GlassCard>

      {/* Menu Items */}
      <GlassCard
        variant="subtle"
        className="p-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-neon-purple/20 flex items-center justify-center">
            <Package className="w-5 h-5 text-neon-purple" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Inventory</p>
            <p className="text-xs text-muted-foreground">{inventoryCount} items collected</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-neon-green/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-neon-green" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-foreground">Achievements</p>
            <p className="text-xs text-muted-foreground">View your badges</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </GlassCard>

      {/* Sign Out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          variant="ghost"
          onClick={onSignOut}
          className="w-full h-14 bg-hp-critical/10 hover:bg-hp-critical/20 text-hp-critical border border-hp-critical/30 rounded-2xl font-display"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
}
