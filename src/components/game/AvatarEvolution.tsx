import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AvatarMood, AvatarStage, AvatarAccessory, AVATAR_STAGES, AVATAR_ACCESSORIES } from '@/types/game';
import { Sparkles, Lock, Check } from 'lucide-react';

interface AvatarEvolutionProps {
  hp: number;
  level: number;
  isAnimating?: boolean;
  equippedAccessories?: {
    hat?: AvatarAccessory;
    weapon?: AvatarAccessory;
    aura?: AvatarAccessory;
    pet?: AvatarAccessory;
  };
  onEquipAccessory?: (accessory: AvatarAccessory) => void;
}

export function AvatarEvolution({ 
  hp, 
  level, 
  isAnimating = false,
  equippedAccessories = {},
  onEquipAccessory 
}: AvatarEvolutionProps) {
  const [showAccessories, setShowAccessories] = useState(false);

  const mood: AvatarMood = useMemo(() => {
    if (hp >= 80) return 'ecstatic';
    if (hp >= 60) return 'happy';
    if (hp >= 40) return 'neutral';
    if (hp >= 20) return 'worried';
    return 'critical';
  }, [hp]);

  const currentStage = useMemo((): AvatarStage => {
    const stages = Object.entries(AVATAR_STAGES).reverse();
    for (const [stage, data] of stages) {
      if (level >= data.minLevel) {
        return stage as AvatarStage;
      }
    }
    return 'egg';
  }, [level]);

  const stageData = AVATAR_STAGES[currentStage];
  const nextStage = useMemo(() => {
    const stageOrder: AvatarStage[] = ['egg', 'hatchling', 'warrior', 'champion', 'legend', 'mythic'];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex < stageOrder.length - 1) {
      return stageOrder[currentIndex + 1];
    }
    return null;
  }, [currentStage]);

  const availableAccessories = useMemo(() => {
    return AVATAR_ACCESSORIES.filter(acc => acc.unlockLevel <= level);
  }, [level]);

  const lockedAccessories = useMemo(() => {
    return AVATAR_ACCESSORIES.filter(acc => acc.unlockLevel > level);
  }, [level]);

  const ringColor = useMemo(() => {
    switch (mood) {
      case 'ecstatic':
      case 'happy':
        return 'border-hp-healthy shadow-[0_0_30px_hsl(var(--hp-healthy)/0.5)]';
      case 'neutral':
        return 'border-hp-warning shadow-[0_0_20px_hsl(var(--hp-warning)/0.3)]';
      case 'worried':
      case 'critical':
        return 'border-hp-critical shadow-[0_0_30px_hsl(var(--hp-critical)/0.5)]';
    }
  }, [mood]);

  const bgGradient = useMemo(() => {
    switch (mood) {
      case 'ecstatic':
      case 'happy':
        return 'from-hp-healthy/20 to-transparent';
      case 'neutral':
        return 'from-hp-warning/20 to-transparent';
      case 'worried':
      case 'critical':
        return 'from-hp-critical/20 to-transparent';
    }
  }, [mood]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Evolution Stage Badge */}
      <motion.div
        className="absolute -top-2 -left-2 z-10 bg-neon-purple text-foreground font-display text-xs font-bold px-2 py-1 rounded-full border-2 border-background shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
      >
        {stageData.name}
      </motion.div>

      {/* Level badge */}
      <motion.div
        className="absolute -top-2 -right-2 z-10 bg-neon-pink text-primary-foreground font-display text-xs font-bold px-2 py-1 rounded-full border-2 border-background shadow-lg"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        LVL {level}
      </motion.div>

      {/* Avatar container */}
      <motion.div
        className={`relative w-36 h-36 rounded-full border-4 ${ringColor} bg-gradient-to-br ${bgGradient} flex items-center justify-center overflow-visible cursor-pointer`}
        onClick={() => setShowAccessories(!showAccessories)}
        animate={
          mood === 'critical'
            ? { x: [-2, 2, -2, 2, 0] }
            : mood === 'ecstatic'
            ? { y: [0, -5, 0] }
            : {}
        }
        transition={
          mood === 'critical'
            ? { duration: 0.4, repeat: Infinity }
            : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        }
        whileHover={{ scale: 1.05 }}
      >
        {/* Aura effect */}
        {equippedAccessories.aura && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 20px hsl(var(--neon-purple)/0.3)`,
                `0 0 40px hsl(var(--neon-purple)/0.5)`,
                `0 0 20px hsl(var(--neon-purple)/0.3)`,
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* Inner glow */}
        <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${bgGradient} opacity-50`} />

        {/* Hat accessory */}
        {equippedAccessories.hat && (
          <motion.span
            className="absolute -top-4 text-3xl z-20"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {equippedAccessories.hat.icon}
          </motion.span>
        )}
        
        {/* Avatar stage icon */}
        <motion.span
          className="text-6xl relative z-10"
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {stageData.icon}
        </motion.span>

        {/* Weapon accessory */}
        {equippedAccessories.weapon && (
          <motion.span
            className="absolute -right-2 bottom-4 text-2xl z-20"
            initial={{ rotate: -45, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
          >
            {equippedAccessories.weapon.icon}
          </motion.span>
        )}

        {/* Pet accessory */}
        {equippedAccessories.pet && (
          <motion.span
            className="absolute -left-4 bottom-2 text-2xl z-20"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {equippedAccessories.pet.icon}
          </motion.span>
        )}

        {/* Scan effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-transparent rounded-full"
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>

      {/* Status text */}
      <motion.div
        className={`mt-3 font-display text-sm uppercase tracking-wider ${
          mood === 'critical' ? 'text-hp-critical' : mood === 'worried' ? 'text-hp-warning' : 'text-hp-healthy'
        }`}
        animate={mood === 'critical' ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {mood === 'ecstatic' && '✨ THRIVING ✨'}
        {mood === 'happy' && 'Doing Great'}
        {mood === 'neutral' && 'Stable'}
        {mood === 'worried' && '⚠️ Low Funds'}
        {mood === 'critical' && '🚨 CRITICAL 🚨'}
      </motion.div>

      {/* Next evolution hint */}
      {nextStage && (
        <p className="text-xs text-muted-foreground mt-2">
          Next: {AVATAR_STAGES[nextStage].name} at LVL {AVATAR_STAGES[nextStage].minLevel}
        </p>
      )}

      {/* Accessory Panel */}
      <AnimatePresence>
        {showAccessories && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-4 overflow-hidden"
          >
            <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-neon-purple" />
                <span className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                  Accessories
                </span>
              </div>

              {/* Available accessories */}
              {availableAccessories.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {availableAccessories.map((acc) => {
                    const isEquipped = Object.values(equippedAccessories).some(e => e?.id === acc.id);
                    return (
                      <motion.button
                        key={acc.id}
                        className={`p-2 rounded-lg text-xl relative ${
                          isEquipped 
                            ? 'bg-neon-green/20 border border-neon-green/50' 
                            : 'bg-muted/50 border border-border/30 hover:border-neon-purple/50'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEquipAccessory?.(acc)}
                      >
                        {acc.icon}
                        {isEquipped && (
                          <Check className="absolute -top-1 -right-1 w-3 h-3 text-neon-green" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Locked accessories */}
              {lockedAccessories.length > 0 && (
                <div className="grid grid-cols-4 gap-2 opacity-50">
                  {lockedAccessories.slice(0, 4).map((acc) => (
                    <div
                      key={acc.id}
                      className="p-2 rounded-lg text-xl bg-muted/30 border border-border/20 relative"
                    >
                      {acc.icon}
                      <Lock className="absolute -top-1 -right-1 w-3 h-3 text-muted-foreground" />
                      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] bg-muted px-1 rounded">
                        L{acc.unlockLevel}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground mt-2">
        Tap avatar to customize
      </p>
    </div>
  );
}