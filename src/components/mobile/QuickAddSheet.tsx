import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, DollarSign } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface QuickAddSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (amount: number, category: string, description: string) => void | Promise<void>;
  onAddIncome: (amount: number, description: string) => Promise<{ xpGained: number; levelUp: boolean }>;
}

export function QuickAddSheet({ isOpen, onClose, onAddExpense, onAddIncome }: QuickAddSheetProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsSubmitting(true);
    try {
      if (type === 'expense') {
        await onAddExpense(numAmount, category, description || 'Quick expense');
      } else {
        await onAddIncome(numAmount, description || 'Quick income');
      }
      setAmount('');
      setDescription('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 liquid-glass-strong rounded-t-3xl border-t border-white/20 max-h-[85vh] overflow-y-auto pb-safe"
          >
            <div className="p-6">
              {/* Handle */}
              <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-6" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-xl font-bold text-foreground">
                  Quick Add
                </h2>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Type toggle */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setType('expense')}
                  className={`flex-1 py-4 px-4 rounded-2xl font-display text-sm transition-all flex items-center justify-center gap-2 ${
                    type === 'expense'
                      ? 'bg-hp-critical/20 text-hp-critical border-2 border-hp-critical/50'
                      : 'bg-white/5 text-muted-foreground border-2 border-transparent'
                  }`}
                >
                  <Minus className="w-5 h-5" />
                  Expense
                </button>
                <button
                  onClick={() => setType('income')}
                  className={`flex-1 py-4 px-4 rounded-2xl font-display text-sm transition-all flex items-center justify-center gap-2 ${
                    type === 'income'
                      ? 'bg-hp-healthy/20 text-hp-healthy border-2 border-hp-healthy/50'
                      : 'bg-white/5 text-muted-foreground border-2 border-transparent'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  Income
                </button>
              </div>

              {/* Amount input */}
              <div className="relative mb-6">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
                <Input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-12 h-16 text-2xl font-display bg-white/5 border-white/10 rounded-2xl focus:border-neon-green"
                />
              </div>

              {/* Category selection for expenses */}
              {type === 'expense' && (
                <div className="mb-6">
                  <p className="text-xs text-muted-foreground mb-3 font-display uppercase tracking-wider">
                    Category
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={`p-4 rounded-2xl text-center transition-all ${
                          category === cat.id
                            ? 'bg-neon-pink/20 border-2 border-neon-pink/50 scale-105'
                            : 'bg-white/5 border-2 border-transparent hover:border-white/10'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{cat.icon}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{cat.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <Input
                placeholder="Add a note (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-6 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-neon-green"
              />

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !amount}
                className={`w-full h-14 font-display text-lg rounded-2xl ${
                  type === 'expense'
                    ? 'bg-hp-critical hover:bg-hp-critical/80 text-background'
                    : 'bg-hp-healthy hover:bg-hp-healthy/80 text-background'
                }`}
              >
                {isSubmitting ? 'Processing...' : type === 'expense' ? '⚔️ Log Expense' : '💚 Log Income'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
