import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'strong' | 'subtle';
  glow?: 'green' | 'pink' | 'purple' | 'cyan' | 'none';
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ 
  variant = 'default', 
  glow = 'none',
  children, 
  className,
  ...props 
}: GlassCardProps) {
  const variantClasses = {
    default: 'liquid-glass',
    strong: 'liquid-glass-strong',
    subtle: 'liquid-glass-subtle',
  };

  const glowClasses = {
    none: '',
    green: 'shadow-[0_0_30px_hsl(var(--neon-green)/0.15)] border-neon-green/30',
    pink: 'shadow-[0_0_30px_hsl(var(--neon-pink)/0.15)] border-neon-pink/30',
    purple: 'shadow-[0_0_30px_hsl(var(--neon-purple)/0.15)] border-neon-purple/30',
    cyan: 'shadow-[0_0_30px_hsl(var(--neon-cyan)/0.15)] border-neon-cyan/30',
  };

  return (
    <motion.div
      className={cn(
        'rounded-3xl border p-4',
        variantClasses[variant],
        glowClasses[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
