import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { BossFight } from '@/components/game/BossFight';
import { DungeonMap } from '@/components/game/DungeonMap';
import { Boss, Dungeon } from '@/types/game';

interface BattleTabProps {
  bosses: Boss[];
  dungeons: Dungeon[];
  onDefeatBoss: (bossId: string, amount: number) => Promise<void>;
}

export function BattleTab({ bosses, dungeons, onDefeatBoss }: BattleTabProps) {
  return (
    <div className="space-y-4 pb-24">
      {/* Boss Fights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <BossFight bosses={bosses} onDefeatBoss={onDefeatBoss} />
      </motion.div>

      {/* Dungeon Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <DungeonMap dungeons={dungeons} />
      </motion.div>
    </div>
  );
}
