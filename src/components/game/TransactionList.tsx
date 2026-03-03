import { motion } from 'framer-motion';
import { Transaction, EXPENSE_CATEGORIES } from '@/types/game';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const { currency } = useCurrency();
  const getCategoryInfo = (categoryId: string) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === categoryId) || EXPENSE_CATEGORIES[5];
  };

  return (
    <div className="glass-panel p-6 border border-border/50">
      <h3 className="font-display text-lg font-bold text-foreground mb-4">
        Recent Activity
      </h3>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No transactions yet. Start logging!
          </p>
        ) : (
          transactions.slice(0, 5).map((tx, index) => {
            const category = getCategoryInfo(tx.category);
            return (
              <motion.div
                key={tx.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'expense' ? 'bg-hp-critical/20' : 'bg-hp-healthy/20'
                    }`}
                >
                  {tx.type === 'expense' ? (
                    <span className="text-lg">{category.icon}</span>
                  ) : (
                    <ArrowUpRight className="w-5 h-5 text-hp-healthy" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {tx.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.type === 'expense' ? category.name : 'Income'} • {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>

                <div className={`font-display font-bold ${tx.type === 'expense' ? 'text-hp-critical' : 'text-hp-healthy'}`}>
                  {tx.type === 'expense' ? '-' : '+'}{currency}{tx.amount.toFixed(2)}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
