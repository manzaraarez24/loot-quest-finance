import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Shield, Wallet, Target, Sparkles, ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from 'sonner';

type Currency = '$' | '€' | '£' | '¥' | '₹';

const CURRENCY_OPTIONS: { symbol: Currency; name: string; flag: string }[] = [
  { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
];

const Onboarding = () => {
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currency);
  const [budget, setBudget] = useState(2000);
  const [expectedExpenses, setExpectedExpenses] = useState(1500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [budgetInput, setBudgetInput] = useState('2000');
  const [expenseInput, setExpenseInput] = useState('1500');

  const handleComplete = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('user_stats')
        .update({
          monthly_limit: budget,
          balance: budget,
          expected_expenses: expectedExpenses,
          onboarding_completed: true,
          hp: 100,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Your quest begins!');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed inset-0 cyber-grid opacity-30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-80 h-80 bg-neon-green/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-80 h-80 bg-neon-pink/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Shield className="w-8 h-8 text-neon-green" />
            <h1 className="font-display text-3xl font-black tracking-tight">
              <span className="text-neon-green neon-text-green">LOOT</span>
              <span className="text-neon-pink neon-text-pink">BAG</span>
            </h1>
            <Wallet className="w-8 h-8 text-neon-pink" />
          </motion.div>
          <p className="text-muted-foreground">Set up your financial quest</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8 justify-center">
          {[0, 1, 2].map((s) => (
            <motion.div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${s <= step ? 'w-12 bg-neon-green' : 'w-8 bg-white/20'
                }`}
              animate={{ scale: s === step ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            />
          ))}
        </div>

        {/* Step 0: Currency Selection */}
        {step === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="liquid-glass-strong rounded-3xl p-6 space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-neon-cyan" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Choose Your Currency</h2>
              <p className="text-sm text-muted-foreground">
                Select the currency for your financial adventure
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CURRENCY_OPTIONS.map((option) => (
                <motion.button
                  key={option.symbol}
                  onClick={() => setSelectedCurrency(option.symbol)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    selectedCurrency === option.symbol
                      ? 'border-neon-cyan bg-neon-cyan/10'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-2">{option.flag}</div>
                  <div className="text-sm font-semibold">{option.symbol}</div>
                  <div className="text-xs text-muted-foreground">{option.name}</div>
                </motion.button>
              ))}
            </div>

            <Button
              onClick={() => {
                setCurrency(selectedCurrency);
                setStep(1);
              }}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-green text-background font-display font-bold text-lg"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {/* Step 1: Budget */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="liquid-glass-strong rounded-3xl p-6 space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neon-green/20 flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-neon-green" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Monthly Budget</h2>
              <p className="text-sm text-muted-foreground">
                How much can you spend this month?
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <span className="font-display text-4xl font-black text-neon-green">
                  {currency}{budget.toLocaleString()}
                </span>
              </div>

              <Slider
                value={[budget]}
                onValueChange={(value) => {
                  setBudget(value[0]);
                  setBudgetInput(String(value[0]));
                }}
                min={500}
                max={10000}
                step={100}
                className="py-4"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currency}500</span>
                <span>{currency}10,000</span>
              </div>

              <div className="relative">
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Or enter custom amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span>
                  <Input
                    type="number"
                    value={budgetInput}
                    onChange={(e) => {
                      setBudgetInput(e.target.value);
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0) setBudget(val);
                    }}
                    onBlur={() => {
                      const val = parseInt(budgetInput);
                      const final = isNaN(val) || val < 100 ? 100 : val;
                      setBudget(final);
                      setBudgetInput(String(final));
                    }}
                    className="pl-7 bg-white/5 border-white/20 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep(0)}
                className="flex-1 h-14 rounded-2xl border border-white/20"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-neon-green to-neon-cyan text-background font-display font-bold text-lg"
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Expected Expenses */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="liquid-glass-strong rounded-3xl p-6 space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neon-pink/20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-neon-pink" />
              </div>
              <h2 className="font-display text-xl font-bold mb-2">Expected Expenses</h2>
              <p className="text-sm text-muted-foreground">
                What's your target spending goal?
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <span className="font-display text-4xl font-black text-neon-pink">
                  {currency}{expectedExpenses.toLocaleString()}
                </span>
                <p className="text-xs text-muted-foreground mt-2">
                  {expectedExpenses < budget
                    ? `You'll save ${currency}${(budget - expectedExpenses).toLocaleString()} this month!`
                    : 'Try to keep it under budget!'}
                </p>
              </div>

              <Slider
                value={[expectedExpenses]}
                onValueChange={(value) => {
                  setExpectedExpenses(value[0]);
                  setExpenseInput(String(value[0]));
                }}
                min={100}
                max={budget}
                step={50}
                className="py-4"
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currency}100</span>
                <span>{currency}{budget.toLocaleString()}</span>
              </div>

              <div className="relative">
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Or enter custom amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{currency}</span>
                  <Input
                    type="number"
                    value={expenseInput}
                    onChange={(e) => {
                      setExpenseInput(e.target.value);
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val >= 0) setExpectedExpenses(val);
                    }}
                    onBlur={() => {
                      const val = parseInt(expenseInput);
                      const final = isNaN(val) || val < 0 ? 0 : Math.min(val, budget);
                      setExpectedExpenses(final);
                      setExpenseInput(String(final));
                    }}
                    className="pl-7 bg-white/5 border-white/20 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white/5 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Budget</span>
                <span className="font-bold text-neon-green">{currency}{budget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Expected Expenses</span>
                <span className="font-bold text-neon-pink">{currency}{expectedExpenses.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Potential Savings</span>
                  <span className="font-bold text-neon-cyan">
                    {currency}{Math.max(0, budget - expectedExpenses).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="flex-1 h-14 rounded-2xl border border-white/20"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-neon-pink to-neon-purple text-white font-display font-bold text-lg"
              >
                {isSubmitting ? (
                  <Sparkles className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Start Quest
                    <Sparkles className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Onboarding;
