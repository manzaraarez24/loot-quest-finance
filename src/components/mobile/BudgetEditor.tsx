import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, DollarSign, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BudgetEditorProps {
  currentBudget: number;
  onUpdateBudget: (newBudget: number) => Promise<void>;
  balance: number;
  hp: number;
}

export function BudgetEditor({ currentBudget, onUpdateBudget, balance, hp }: BudgetEditorProps) {
  const { currency } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(currentBudget.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    const budget = parseFloat(newBudget);
    if (isNaN(budget) || budget <= 0) return;

    setIsUpdating(true);
    try {
      await onUpdateBudget(budget);
      setIsEditing(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setNewBudget(currentBudget.toString());
    setIsEditing(false);
  };

  const spent = currentBudget - balance;
  const spentPercentage = Math.min(100, (spent / currentBudget) * 100);
  const remaining = balance;

  return (
    <div className="space-y-4">
      {/* Budget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Monthly Budget</span>
          <button
            onClick={() => {
              setNewBudget(currentBudget.toString());
              setIsEditing(true);
            }}
            className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span>
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-28 h-8 pl-7 text-sm bg-white/10 border-white/20 rounded-lg"
                  autoFocus
                />
              </div>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isUpdating}
                className="h-8 w-8 p-0 bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/50"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="h-8 w-8 p-0 hover:bg-white/10 text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          ) : (
            <motion.span
              key="display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display text-xl font-bold text-foreground"
            >
              {currency}{currentBudget.toLocaleString()}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Budget Progress Bar */}
      <div className="relative h-4 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${hp < 20 ? 'bg-hp-critical' : hp < 50 ? 'bg-hp-warning' : 'bg-hp-healthy'
            }`}
          initial={{ width: 0 }}
          animate={{ width: `${100 - spentPercentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>

      {/* Budget Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-2xl p-3 text-center">
          <span className="text-xs text-muted-foreground block mb-1">Remaining</span>
          <span className={`font-display text-lg font-bold ${remaining > 0 ? 'text-hp-healthy' : 'text-hp-critical'
            }`}>
            {currency}{remaining.toLocaleString()}
          </span>
        </div>
        <div className="bg-white/5 rounded-2xl p-3 text-center">
          <span className="text-xs text-muted-foreground block mb-1">Spent</span>
          <span className="font-display text-lg font-bold text-neon-pink">
            {currency}{spent > 0 ? spent.toLocaleString() : '0'}
          </span>
        </div>
      </div>
    </div>
  );
}
