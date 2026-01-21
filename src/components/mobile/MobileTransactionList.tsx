import { motion } from 'framer-motion';
import { EXPENSE_CATEGORIES } from '@/types/game';
import { ArrowUpRight } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  description: string;
  date: Date;
}

interface MobileTransactionListProps {
  transactions: Transaction[];
}

export function MobileTransactionList({ transactions }: MobileTransactionListProps) {
  const getCategoryInfo = (categoryId: string) => {
    return EXPENSE_CATEGORIES.find((c) => c.id === categoryId) || EXPENSE_CATEGORIES[5];
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl block mb-2">📝</span>
        <p className="text-muted-foreground text-sm">No transactions yet</p>
        <p className="text-muted-foreground text-xs">Tap + to add your first one!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display text-sm font-bold text-foreground">Recent Activity</h3>
        <span className="text-xs text-muted-foreground">{transactions.length} total</span>
      </div>
      
      <div className="space-y-2">
        {transactions.slice(0, 5).map((tx, index) => {
          const category = getCategoryInfo(tx.category);
          return (
            <motion.div
              key={tx.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'expense' ? 'bg-hp-critical/20' : 'bg-hp-healthy/20'
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

              <span className={`font-display font-bold text-sm ${
                tx.type === 'expense' ? 'text-hp-critical' : 'text-hp-healthy'
              }`}>
                {tx.type === 'expense' ? '-' : '+'}${tx.amount.toFixed(0)}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
