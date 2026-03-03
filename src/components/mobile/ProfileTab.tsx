import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { LogOut, Shield, User, Package, ChevronRight, Settings, DollarSign, Target, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface ProfileTabProps {
  email: string;
  stats: {
    level: number;
    xp: number;
    gems: number;
    streakDays: number;
  };
  budgetSettings?: {
    monthlyLimit: number;
    expectedExpenses: number;
  };
  inventoryCount: number;
  onSignOut: () => void;
  onUpdateBudgetSettings?: (budget: number, expectedExpenses: number) => Promise<void>;
}

export function ProfileTab({ 
  email, 
  stats, 
  budgetSettings,
  inventoryCount, 
  onSignOut,
  onUpdateBudgetSettings,
}: ProfileTabProps) {
  const username = email.split('@')[0];
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [editBudget, setEditBudget] = useState(budgetSettings?.monthlyLimit || 2000);
  const [editExpenses, setEditExpenses] = useState(budgetSettings?.expectedExpenses || 1500);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSaveBudget = async () => {
    if (!onUpdateBudgetSettings) return;
    setIsUpdating(true);
    try {
      await onUpdateBudgetSettings(editBudget, editExpenses);
      setIsEditingBudget(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditBudget(budgetSettings?.monthlyLimit || 2000);
    setEditExpenses(budgetSettings?.expectedExpenses || 1500);
    setIsEditingBudget(false);
  };

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

      {/* Budget Settings */}
      <GlassCard
        glow="green"
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Budget Settings
          </h3>
          {!isEditingBudget && (
            <button
              onClick={() => setIsEditingBudget(true)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isEditingBudget ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-5"
            >
              {/* Budget Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" />
                    Monthly Budget
                  </Label>
                  <span className="font-display text-lg font-bold text-neon-green">
                    ${editBudget.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[editBudget]}
                  onValueChange={(value) => setEditBudget(value[0])}
                  min={500}
                  max={10000}
                  step={100}
                  className="py-2"
                />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={editBudget}
                    onChange={(e) => setEditBudget(Math.max(100, parseInt(e.target.value) || 0))}
                    className="pl-8 bg-white/5 border-white/20 rounded-xl h-10"
                  />
                </div>
              </div>

              {/* Expected Expenses Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    Expected Expenses
                  </Label>
                  <span className="font-display text-lg font-bold text-neon-pink">
                    ${editExpenses.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[editExpenses]}
                  onValueChange={(value) => setEditExpenses(value[0])}
                  min={100}
                  max={editBudget}
                  step={50}
                  className="py-2"
                />
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={editExpenses}
                    onChange={(e) => setEditExpenses(Math.max(0, parseInt(e.target.value) || 0))}
                    className="pl-8 bg-white/5 border-white/20 rounded-xl h-10"
                  />
                </div>
              </div>

              {/* Potential Savings Preview */}
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <span className="text-xs text-muted-foreground">Potential Monthly Savings</span>
                <p className="font-display text-xl font-bold text-neon-cyan">
                  ${Math.max(0, editBudget - editExpenses).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleCancelEdit}
                  className="flex-1 h-12 rounded-xl border border-white/20"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveBudget}
                  disabled={isUpdating}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-r from-neon-green to-neon-cyan text-background font-display font-bold"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <DollarSign className="w-5 h-5 text-neon-green mx-auto mb-1" />
                <p className="font-display text-xl font-bold text-foreground">
                  ${(budgetSettings?.monthlyLimit || 2000).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Monthly Budget</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <Target className="w-5 h-5 text-neon-pink mx-auto mb-1" />
                <p className="font-display text-xl font-bold text-foreground">
                  ${(budgetSettings?.expectedExpenses || 1500).toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Expected Expenses</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
