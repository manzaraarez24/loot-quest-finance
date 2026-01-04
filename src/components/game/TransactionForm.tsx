import { useState } from 'react';
import { motion } from 'framer-motion';
import { EXPENSE_CATEGORIES } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, DollarSign } from 'lucide-react';

interface TransactionFormProps {
  onAddExpense: (amount: number, category: string, description: string) => void;
  onAddIncome: (amount: number, description: string) => { xpGained: number; levelUp: boolean };
}

export function TransactionForm({ onAddExpense, onAddIncome }: TransactionFormProps) {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [showXPGain, setShowXPGain] = useState<number | null>(null);

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (type === 'expense') {
      onAddExpense(numAmount, category, description || 'Expense');
    } else {
      const result = onAddIncome(numAmount, description || 'Income');
      setShowXPGain(result.xpGained);
      setTimeout(() => setShowXPGain(null), 2000);
    }

    setAmount('');
    setDescription('');
  };

  return (
    <div className="glass-panel p-6 border border-border/50">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">
        Log Transaction
      </h3>

      {/* Type toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setType('expense')}
          className={`flex-1 py-3 px-4 rounded-lg font-display text-sm transition-all flex items-center justify-center gap-2 ${
            type === 'expense'
              ? 'bg-hp-critical/20 text-hp-critical border border-hp-critical/50'
              : 'bg-muted text-muted-foreground border border-transparent hover:border-border'
          }`}
        >
          <Minus className="w-4 h-4" />
          Expense
        </button>
        <button
          onClick={() => setType('income')}
          className={`flex-1 py-3 px-4 rounded-lg font-display text-sm transition-all flex items-center justify-center gap-2 ${
            type === 'income'
              ? 'bg-hp-healthy/20 text-hp-healthy border border-hp-healthy/50'
              : 'bg-muted text-muted-foreground border border-transparent hover:border-border'
          }`}
        >
          <Plus className="w-4 h-4" />
          Income
        </button>
      </div>

      {/* Amount input */}
      <div className="relative mb-4">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="pl-10 text-xl font-display bg-muted border-border focus:border-primary"
        />
      </div>

      {/* Category selection for expenses */}
      {type === 'expense' && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 font-display">CATEGORY</p>
          <div className="grid grid-cols-3 gap-2">
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-3 rounded-lg text-center transition-all ${
                  category === cat.id
                    ? 'bg-neon-pink/20 border border-neon-pink/50'
                    : 'bg-muted border border-transparent hover:border-border'
                }`}
              >
                <span className="text-xl block mb-1">{cat.icon}</span>
                <span className="text-[10px] text-muted-foreground">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Description */}
      <Input
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 bg-muted border-border focus:border-primary"
      />

      {/* Submit button */}
      <div className="relative">
        <Button
          onClick={handleSubmit}
          className={`w-full font-display ${
            type === 'expense'
              ? 'bg-hp-critical hover:bg-hp-critical/80 text-background'
              : 'bg-hp-healthy hover:bg-hp-healthy/80 text-background'
          }`}
        >
          {type === 'expense' ? '⚔️ Deal Damage' : '💚 Heal HP'}
        </Button>

        {/* XP gain popup */}
        {showXPGain && (
          <motion.div
            className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-neon-purple rounded-full font-display text-sm text-background"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            +{showXPGain} XP!
          </motion.div>
        )}
      </div>
    </div>
  );
}
