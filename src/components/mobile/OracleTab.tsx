import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { SpendingProphecyCard } from '@/components/game/SpendingProphecy';
import { RegretCalculator } from '@/components/game/RegretCalculator';
import { SpendingPersonaCard } from '@/components/game/SpendingPersona';
import { UserStats, Transaction } from '@/types/game';

interface OracleTabProps {
  stats: UserStats;
  transactions: Transaction[];
}

export function OracleTab({ stats, transactions }: OracleTabProps) {
  return (
    <div className="space-y-4 pb-24">
      {/* Spending Persona */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SpendingPersonaCard transactions={transactions} />
      </motion.div>

      {/* Spending Prophecy */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <SpendingProphecyCard stats={stats} transactions={transactions} />
      </motion.div>

      {/* Regret Calculator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <RegretCalculator />
      </motion.div>
    </div>
  );
}
