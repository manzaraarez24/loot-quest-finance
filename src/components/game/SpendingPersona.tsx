import { motion, AnimatePresence } from 'framer-motion';
import { SpendingPersona as PersonaType, SPENDING_PERSONAS, Transaction } from '@/types/game';
import { useMemo, useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface SpendingPersonaProps {
  transactions: Transaction[];
}

export function SpendingPersonaCard({ transactions }: SpendingPersonaProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const persona = useMemo((): PersonaType => {
    // Analyze spending patterns
    const categoryTotals: Record<string, number> = {};
    
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    // Find dominant category
    let dominantCategory = 'other';
    let maxSpent = 0;
    
    Object.entries(categoryTotals).forEach(([category, amount]) => {
      if (amount > maxSpent) {
        maxSpent = amount;
        dominantCategory = category;
      }
    });

    // Check if user is mostly saving (income > expenses)
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    if (totalIncome > totalExpenses * 1.5) {
      dominantCategory = 'income';
    }

    // Find matching persona
    const matchingPersona = SPENDING_PERSONAS.find(p => p.dominantCategory === dominantCategory);
    return matchingPersona || SPENDING_PERSONAS[7]; // Default to Mystery Merchant
  }, [transactions]);

  const rarityColors = {
    common: 'border-muted-foreground/50 bg-muted/30',
    rare: 'border-neon-purple/50 bg-neon-purple/10',
    legendary: 'border-neon-orange/50 bg-neon-orange/10',
  };

  const rarityGlow = {
    common: '',
    rare: 'shadow-[0_0_20px_hsl(var(--neon-purple)/0.3)]',
    legendary: 'shadow-[0_0_30px_hsl(var(--neon-orange)/0.4)]',
  };

  return (
    <motion.div
      className={`glass-panel border-2 ${rarityColors[persona.rarity]} ${rarityGlow[persona.rarity]} rounded-xl overflow-hidden`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="text-4xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              {persona.icon}
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">
                  {persona.name}
                </h3>
                <Sparkles className={`w-4 h-4 ${
                  persona.rarity === 'legendary' ? 'text-neon-orange' : 
                  persona.rarity === 'rare' ? 'text-neon-purple' : 'text-muted-foreground'
                }`} />
              </div>
              <p className="text-sm text-muted-foreground font-body">
                {persona.title}
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">
              <p className="text-sm text-foreground/80 italic">
                "{persona.description}"
              </p>
              
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">
                  Character Traits
                </p>
                <div className="flex flex-wrap gap-2">
                  {persona.traits.map((trait, i) => (
                    <motion.span
                      key={trait}
                      className="px-2 py-1 text-xs rounded-full bg-muted/50 text-foreground/80 border border-border/50"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      {trait}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className={`p-2 rounded-lg text-center ${
                persona.rarity === 'legendary' ? 'bg-neon-orange/20 text-neon-orange' :
                persona.rarity === 'rare' ? 'bg-neon-purple/20 text-neon-purple' :
                'bg-muted/50 text-muted-foreground'
              }`}>
                <span className="text-xs font-display uppercase tracking-wider">
                  {persona.rarity} Persona
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}