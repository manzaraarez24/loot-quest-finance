import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Calculator, Clock, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCurrency } from '@/contexts/CurrencyContext';
import { RegretCalculation } from '@/types/game';

export function RegretCalculator() {
  const { currency } = useCurrency();
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<RegretCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateRegret = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    setIsCalculating(true);

    setTimeout(() => {
      // Assume 7% annual return compounded
      const yearsInvested = 10;
      const annualReturn = 0.07;
      const projectedValue = numAmount * Math.pow(1 + annualReturn, yearsInvested);

      // Fun alternative uses
      const alternativeUses = [
        { item: 'Coffees', icon: '☕', quantity: Math.floor(numAmount / 5) },
        { item: 'Netflix months', icon: '🎬', quantity: Math.floor(numAmount / 15) },
        { item: 'Avocado toasts', icon: '🥑', quantity: Math.floor(numAmount / 12) },
        { item: 'Uber rides', icon: '🚗', quantity: Math.floor(numAmount / 15) },
        { item: 'Pizzas', icon: '🍕', quantity: Math.floor(numAmount / 20) },
      ];

      setResult({
        originalAmount: numAmount,
        yearsInvested,
        projectedValue,
        alternativeUses: alternativeUses.filter(a => a.quantity > 0).slice(0, 4),
      });

      setIsCalculating(false);
    }, 800);
  };

  const reset = () => {
    setAmount('');
    setResult(null);
  };

  return (
    <motion.div
      className="glass-panel border border-neon-cyan/30 p-4 rounded-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-neon-cyan" />
        <h3 className="font-display text-lg font-bold text-foreground">
          Regret Calculator
        </h3>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        See what that impulse buy could be worth in 10 years 😱
      </p>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-display font-bold">{currency}</span>
              <Input
                type="number"
                placeholder="Enter amount..."
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-muted/50 border-border/50"
              />
            </div>

            <Button
              onClick={calculateRegret}
              disabled={!amount || isCalculating}
              className="w-full bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/50"
            >
              {isCalculating ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🔮
                </motion.span>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Calculate Future Value
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Original vs Future */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Now</p>
                <p className="text-xl font-display font-bold text-foreground">
                  {currency}{result.originalAmount.toFixed(2)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-neon-green/10 border border-neon-green/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">In {result.yearsInvested} Years</p>
                <motion.p
                  className="text-xl font-display font-bold text-neon-green"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  {currency}{result.projectedValue.toFixed(2)}
                </motion.p>
              </div>
            </div>

            {/* Growth indicator */}
            <div className="flex items-center justify-center gap-2 text-neon-green">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">
                +{((result.projectedValue / result.originalAmount - 1) * 100).toFixed(0)}% growth
              </span>
            </div>

            {/* Alternative uses */}
            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-3 text-center">
                That's also equivalent to...
              </p>
              <div className="grid grid-cols-2 gap-2">
                {result.alternativeUses.map((alt, i) => (
                  <motion.div
                    key={alt.item}
                    className="p-2 rounded-lg bg-muted/30 border border-border/30 text-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <span className="text-xl">{alt.icon}</span>
                    <p className="text-lg font-bold text-foreground">{alt.quantity}</p>
                    <p className="text-xs text-muted-foreground">{alt.item}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Reset button */}
            <Button
              onClick={reset}
              variant="outline"
              className="w-full border-border/50 hover:bg-muted/50"
            >
              Calculate Another
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}