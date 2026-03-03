import { motion } from 'framer-motion';
import { SpendingProphecy as ProphecyType, Transaction, UserStats } from '@/types/game';
import { useMemo } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface SpendingProphecyProps {
  stats: UserStats;
  transactions: Transaction[];
}

export function SpendingProphecyCard({ stats, transactions }: SpendingProphecyProps) {
  const { currency } = useCurrency();
  const prophecy = useMemo((): ProphecyType => {
    // Calculate daily spending average
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const avgDailyExpense = expenses.length > 0 ? totalExpenses / Math.max(expenses.length, 1) : 0;

    // Days remaining in month (simplified - assume 30 day month)
    const today = new Date();
    const daysRemaining = 30 - today.getDate();

    // Predicted end balance
    const predictedSpending = avgDailyExpense * daysRemaining;
    const predictedEndBalance = stats.currentBalance - predictedSpending;

    // Determine trend
    let trend: ProphecyType['trend'];
    let confidence: number;
    let message: string;
    let recommendations: string[];

    const balanceRatio = predictedEndBalance / stats.monthlyLimit;

    if (balanceRatio >= 0.3) {
      trend = 'improving';
      confidence = 85;
      message = "The stars align in your favor! Your savings destiny is bright.";
      recommendations = [
        "Consider investing your surplus",
        "Maintain your current pace",
        "Reward yourself with a small treat"
      ];
    } else if (balanceRatio >= 0.1) {
      trend = 'stable';
      confidence = 70;
      message = "Balance is maintained, young warrior. Stay vigilant.";
      recommendations = [
        "Track daily expenses closely",
        "Look for small savings opportunities",
        "Avoid impulse purchases"
      ];
    } else if (balanceRatio >= 0) {
      trend = 'declining';
      confidence = 60;
      message = "Warning signs appear in the crystal ball. Caution advised.";
      recommendations = [
        "Cut non-essential spending",
        "Review subscriptions",
        "Prepare emergency budget"
      ];
    } else {
      trend = 'critical';
      confidence = 45;
      message = "Dark clouds gather! Immediate action required to change fate.";
      recommendations = [
        "STOP all non-essential purchases",
        "Seek additional income sources",
        "Contact creditors if needed"
      ];
    }

    return {
      predictedEndBalance: Math.max(predictedEndBalance, -1000),
      confidence,
      trend,
      message,
      recommendations
    };
  }, [stats, transactions]);

  const getTrendIcon = () => {
    switch (prophecy.trend) {
      case 'improving': return <TrendingUp className="w-5 h-5 text-neon-green" />;
      case 'stable': return <Minus className="w-5 h-5 text-hp-warning" />;
      case 'declining': return <TrendingDown className="w-5 h-5 text-neon-orange" />;
      case 'critical': return <AlertTriangle className="w-5 h-5 text-hp-critical" />;
    }
  };

  const getTrendColor = () => {
    switch (prophecy.trend) {
      case 'improving': return 'border-neon-green/50 bg-neon-green/5';
      case 'stable': return 'border-hp-warning/50 bg-hp-warning/5';
      case 'declining': return 'border-neon-orange/50 bg-neon-orange/5';
      case 'critical': return 'border-hp-critical/50 bg-hp-critical/5';
    }
  };

  return (
    <motion.div
      className={`glass-panel border-2 ${getTrendColor()} rounded-xl p-4 overflow-hidden relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Mystical background effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, hsl(var(--neon-purple)/0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, hsl(var(--neon-purple)/0.3) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, hsl(var(--neon-purple)/0.3) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles className="w-5 h-5 text-neon-purple" />
          </motion.div>
          <h3 className="font-display text-lg font-bold text-foreground">
            Spending Prophecy
          </h3>
          {getTrendIcon()}
        </div>

        {/* Crystal Ball */}
        <div className="flex justify-center mb-4">
          <motion.div
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-neon-purple/30 to-neon-cyan/20 border-2 border-neon-purple/50 flex items-center justify-center"
            animate={{
              boxShadow: [
                '0 0 20px hsl(var(--neon-purple)/0.3)',
                '0 0 40px hsl(var(--neon-purple)/0.5)',
                '0 0 20px hsl(var(--neon-purple)/0.3)',
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-3xl">🔮</span>

            {/* Floating particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-neon-purple rounded-full"
                animate={{
                  y: [0, -30, 0],
                  x: [0, (i - 1) * 15, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Prediction */}
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-1">End of Month Balance</p>
          <motion.p
            className={`text-3xl font-display font-bold ${prophecy.predictedEndBalance >= 0 ? 'text-neon-green' : 'text-hp-critical'
              }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            {currency}{prophecy.predictedEndBalance.toFixed(0)}
          </motion.p>
          <p className="text-xs text-muted-foreground mt-1">
            {prophecy.confidence}% confidence
          </p>
        </div>

        {/* Message */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border/50 mb-4">
          <p className="text-sm text-foreground/80 italic text-center">
            "{prophecy.message}"
          </p>
        </div>

        {/* Recommendations */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">
            The Oracle Suggests
          </p>
          <ul className="space-y-1">
            {prophecy.recommendations.map((rec, i) => (
              <motion.li
                key={i}
                className="text-xs text-foreground/70 flex items-start gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-neon-purple">•</span>
                {rec}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div >
  );
}