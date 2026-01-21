import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { AvatarMood, AvatarStage, AvatarAccessory, AVATAR_STAGES, AVATAR_ACCESSORIES } from '@/types/game';
import { Sparkles, Lock, Check, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface MobileAvatarProps {
  hp: number;
  level: number;
  equippedAccessories?: {
    hat?: AvatarAccessory;
    weapon?: AvatarAccessory;
    aura?: AvatarAccessory;
    pet?: AvatarAccessory;
  };
  onEquipAccessory?: (accessory: AvatarAccessory) => void;
}

export function MobileAvatar({ 
  hp, 
  level, 
  equippedAccessories = {},
  onEquipAccessory 
}: MobileAvatarProps) {
  const [showAccessoryPanel, setShowAccessoryPanel] = useState(false);

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
        return 'border-hp-healthy shadow-[0_0_20px_hsl(var(--hp-healthy)/0.4)]';
      case 'neutral':
        return 'border-hp-warning shadow-[0_0_15px_hsl(var(--hp-warning)/0.3)]';
      case 'worried':
      case 'critical':
        return 'border-hp-critical shadow-[0_0_20px_hsl(var(--hp-critical)/0.4)]';
    }
  }, [mood]);

  return (
    <>
      <motion.div
        className={`relative w-20 h-20 rounded-full border-3 ${ringColor} bg-white/5 flex items-center justify-center cursor-pointer`}
        onClick={() => setShowAccessoryPanel(true)}
        whileTap={{ scale: 0.95 }}
        animate={
          mood === 'critical' ? { x: [-1, 1, -1, 1, 0] } : {}
        }
        transition={
          mood === 'critical' ? { duration: 0.4, repeat: Infinity } : {}
        }
      >
        {/* Aura effect */}
        {equippedAccessories.aura && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                `0 0 15px hsl(var(--neon-purple)/0.3)`,
                `0 0 30px hsl(var(--neon-purple)/0.5)`,
                `0 0 15px hsl(var(--neon-purple)/0.3)`,
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* Hat */}
        {equippedAccessories.hat && (
          <span className="absolute -top-3 text-xl z-10">{equippedAccessories.hat.icon}</span>
        )}
        
        {/* Avatar */}
        <span className="text-4xl relative z-0">{stageData.icon}</span>

        {/* Weapon */}
        {equippedAccessories.weapon && (
          <span className="absolute -right-1 bottom-1 text-lg z-10">{equippedAccessories.weapon.icon}</span>
        )}

        {/* Pet */}
        {equippedAccessories.pet && (
          <motion.span 
            className="absolute -left-2 bottom-0 text-lg z-10"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {equippedAccessories.pet.icon}
          </motion.span>
        )}

        {/* Level badge */}
        <div className="absolute -bottom-1 -right-1 bg-neon-pink text-[10px] font-display font-bold text-white px-1.5 py-0.5 rounded-full">
          {level}
        </div>
      </motion.div>

      {/* Accessory Panel Modal */}
      <AnimatePresence>
        {showAccessoryPanel && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccessoryPanel(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-4 z-50 liquid-glass-strong rounded-3xl border border-white/20 overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-neon-purple" />
                    <h3 className="font-display text-lg font-bold">Customize Avatar</h3>
                  </div>
                  <button
                    onClick={() => setShowAccessoryPanel(false)}
                    className="p-2 hover:bg-white/10 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Avatar Preview */}
                <div className="flex justify-center py-6">
                  <div className={`relative w-28 h-28 rounded-full border-4 ${ringColor} bg-white/5 flex items-center justify-center`}>
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
                    {equippedAccessories.hat && (
                      <span className="absolute -top-4 text-3xl z-10">{equippedAccessories.hat.icon}</span>
                    )}
                    <span className="text-5xl relative z-0">{stageData.icon}</span>
                    {equippedAccessories.weapon && (
                      <span className="absolute -right-2 bottom-2 text-2xl z-10">{equippedAccessories.weapon.icon}</span>
                    )}
                    {equippedAccessories.pet && (
                      <motion.span 
                        className="absolute -left-3 bottom-1 text-2xl z-10"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {equippedAccessories.pet.icon}
                      </motion.span>
                    )}
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground mb-4">{stageData.name}</p>

                {/* Accessory Slots */}
                {['hat', 'weapon', 'aura', 'pet'].map((slot) => (
                  <div key={slot} className="mb-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{slot}s</p>
                    <div className="grid grid-cols-5 gap-2">
                      {availableAccessories
                        .filter(acc => acc.slot === slot)
                        .map((acc) => {
                          const isEquipped = equippedAccessories[slot as keyof typeof equippedAccessories]?.id === acc.id;
                          return (
                            <motion.button
                              key={acc.id}
                              className={`p-3 rounded-xl text-2xl relative ${
                                isEquipped
                                  ? 'bg-neon-green/20 border-2 border-neon-green/50'
                                  : 'bg-white/5 border-2 border-transparent hover:border-white/20'
                              }`}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => onEquipAccessory?.(acc)}
                            >
                              {acc.icon}
                              {isEquipped && (
                                <Check className="absolute -top-1 -right-1 w-4 h-4 text-neon-green bg-background rounded-full" />
                              )}
                            </motion.button>
                          );
                        })}
                      {lockedAccessories
                        .filter(acc => acc.slot === slot)
                        .slice(0, 2)
                        .map((acc) => (
                          <div
                            key={acc.id}
                            className="p-3 rounded-xl text-2xl relative bg-white/5 opacity-40 border-2 border-transparent"
                          >
                            {acc.icon}
                            <Lock className="absolute -top-1 -right-1 w-3 h-3 text-muted-foreground" />
                            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] bg-muted px-1 rounded">
                              L{acc.unlockLevel}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
