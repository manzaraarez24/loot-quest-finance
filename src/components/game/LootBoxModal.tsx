import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LootItem, LootBoxResult } from '@/types/game';
import { Gift, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LootBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: LootBoxResult | null;
  onOpen: () => LootBoxResult | Promise<LootBoxResult>;
}

export function LootBoxModal({ isOpen, onClose, result, onOpen }: LootBoxModalProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [currentResult, setCurrentResult] = useState<LootBoxResult | null>(result);

  const handleOpen = async () => {
    setIsOpening(true);
    setTimeout(async () => {
      const newResult = await onOpen();
      setCurrentResult(newResult);
      setIsOpening(false);
    }, 1500);
  };

  const rarityColors = {
    common: {
      bg: 'from-muted to-muted/50',
      border: 'border-muted-foreground/50',
      text: 'text-muted-foreground',
      glow: '',
    },
    rare: {
      bg: 'from-neon-purple/30 to-neon-pink/30',
      border: 'border-neon-purple',
      text: 'text-neon-purple',
      glow: 'shadow-[0_0_30px_hsl(var(--neon-purple)/0.5)]',
    },
    legendary: {
      bg: 'from-neon-orange/30 via-hp-warning/30 to-neon-orange/30',
      border: 'border-neon-orange',
      text: 'text-neon-orange',
      glow: 'shadow-[0_0_50px_hsl(var(--neon-orange)/0.7)]',
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md p-8 glass-panel border-2 border-neon-pink/50"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-neon-pink neon-text-pink mb-2">
                LOOT BOX
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {currentResult ? 'You got:' : 'Tap to reveal your reward!'}
              </p>

              {/* Loot box / Result display */}
              <div className="flex justify-center mb-6">
                {!currentResult && !isOpening ? (
                  <motion.div
                    className="w-40 h-40 flex items-center justify-center cursor-pointer"
                    onClick={handleOpen}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="relative w-32 h-32 bg-gradient-to-br from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center shadow-[0_0_40px_hsl(var(--neon-pink)/0.5)]"
                      animate={{
                        rotateY: [0, 10, -10, 0],
                        boxShadow: [
                          '0 0 40px hsl(var(--neon-pink) / 0.5)',
                          '0 0 60px hsl(var(--neon-pink) / 0.7)',
                          '0 0 40px hsl(var(--neon-pink) / 0.5)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Gift className="w-16 h-16 text-background" />
                      <Sparkles className="absolute top-2 right-2 w-5 h-5 text-neon-cyan" />
                    </motion.div>
                  </motion.div>
                ) : isOpening ? (
                  <motion.div
                    className="w-32 h-32 bg-gradient-to-br from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center"
                    animate={{
                      rotateY: [0, 360, 720, 1080],
                      scale: [1, 1.2, 0.8, 1.5],
                    }}
                    transition={{ duration: 1.5 }}
                  >
                    <Sparkles className="w-16 h-16 text-background animate-pulse" />
                  </motion.div>
                ) : currentResult ? (
                  <motion.div
                    className={`w-40 h-40 rounded-2xl bg-gradient-to-br ${rarityColors[currentResult.item.rarity].bg} border-2 ${rarityColors[currentResult.item.rarity].border} ${rarityColors[currentResult.item.rarity].glow} flex flex-col items-center justify-center p-4`}
                    initial={{ scale: 0, rotateY: -180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ type: 'spring', bounce: 0.5 }}
                  >
                    <span className="text-5xl mb-2">{currentResult.item.icon}</span>
                    <span className={`font-display text-sm font-bold ${rarityColors[currentResult.item.rarity].text}`}>
                      {currentResult.item.name}
                    </span>
                    <span className={`text-xs uppercase ${rarityColors[currentResult.item.rarity].text}`}>
                      {currentResult.item.rarity}
                    </span>
                  </motion.div>
                ) : null}
              </div>

              {currentResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm text-muted-foreground mb-4">
                    {currentResult.item.description}
                  </p>
                  {currentResult.isNew && (
                    <span className="inline-block px-3 py-1 bg-neon-green/20 text-neon-green font-display text-xs rounded-full border border-neon-green/50">
                      ✨ NEW UNLOCK!
                    </span>
                  )}
                </motion.div>
              )}

              <Button
                onClick={onClose}
                className="mt-6 w-full"
                variant="outline"
              >
                {currentResult ? 'Claim & Close' : 'Maybe Later'}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
