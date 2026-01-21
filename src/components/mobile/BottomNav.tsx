import { motion } from 'framer-motion';
import { Home, Sword, Sparkles, User, Plus } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onQuickAdd?: () => void;
}

export function BottomNav({ activeTab, onTabChange, onQuickAdd }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'battle', icon: Sword, label: 'Battle' },
    { id: 'add', icon: Plus, label: 'Add', isAction: true },
    { id: 'oracle', icon: Sparkles, label: 'Oracle' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Glass background */}
      <div className="liquid-glass border-t border-white/10">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            
            if (tab.isAction) {
              return (
                <motion.button
                  key={tab.id}
                  onClick={onQuickAdd}
                  className="relative -mt-6"
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center shadow-lg shadow-neon-green/30">
                    <Icon className="w-6 h-6 text-background" />
                  </div>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-1 px-4 py-2 relative"
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon 
                  className={`w-5 h-5 relative z-10 transition-colors ${
                    isActive ? 'text-neon-green' : 'text-muted-foreground'
                  }`} 
                />
                <span 
                  className={`text-[10px] font-medium relative z-10 transition-colors ${
                    isActive ? 'text-neon-green' : 'text-muted-foreground'
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
