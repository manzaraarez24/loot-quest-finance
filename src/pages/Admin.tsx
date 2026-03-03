import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { motion } from 'framer-motion';
import { Shield, Users, RefreshCw, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CustomerData {
    id: string;
    email: string;
    username: string;
    level: number;
    balance: number;
    total_transactions: number;
    joined_at: string;
}

const Admin = () => {
    const { signOut, isAdmin } = useAuth();
    const { currency } = useCurrency();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            // @ts-ignore - RPC generated in migration not yet in local types
            const { data, error } = await supabase.rpc('get_all_customers');
            if (error) {
                console.error('Error fetching customers:', error);
            } else if (data) {
                setCustomers(data);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }
        fetchCustomers();
    }, [isAdmin, navigate]);

    return (
        <div className="min-h-screen bg-background cyber-grid scanline relative overflow-hidden">
            {/* Ambient glow effects */}
            <div className="fixed top-0 right-1/4 w-96 h-96 bg-hp-critical/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
                {/* Header */}
                <motion.header
                    className="text-center mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1 flex justify-start">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/')}
                                className="text-muted-foreground border-border hover:text-foreground"
                            >
                                Back to Game
                            </Button>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <Shield className="w-8 h-8 text-hp-critical" />
                            <h1 className="font-display text-4xl font-black text-foreground tracking-tight">
                                <span className="text-foreground">ADMIN</span>
                                <span className="text-hp-critical neon-text"> MODULE</span>
                            </h1>
                        </div>
                        <div className="flex-1 flex justify-end">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={signOut}
                                className="text-muted-foreground hover:text-hp-critical"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-body">
                        You hold the power. View and monitor player statistics.
                    </p>
                </motion.header>

                {/* Action Bar */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-foreground font-display font-bold">
                        <Users className="w-5 h-5 text-neon-cyan" />
                        <span>{customers.length} Registered Players</span>
                    </div>
                    <Button
                        onClick={fetchCustomers}
                        disabled={loading}
                        variant="outline"
                        className="border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh Data
                    </Button>
                </div>

                {/* Data Table */}
                <motion.section
                    className="glass-panel overflow-x-auto border border-border/50 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <table className="w-full text-left font-body text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/20">
                                <th className="p-4 font-display font-medium text-muted-foreground uppercase tracking-wider">Player</th>
                                <th className="p-4 font-display font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                                <th className="p-4 font-display font-medium text-muted-foreground uppercase tracking-wider text-center">Level</th>
                                <th className="p-4 font-display font-medium text-muted-foreground uppercase tracking-wider text-right">Balance</th>
                                <th className="p-4 font-display font-medium text-muted-foreground uppercase tracking-wider text-center">Txs</th>
                                <th className="p-4 font-display font-medium text-muted-foreground uppercase tracking-wider text-right">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        Scanning database...
                                    </td>
                                </tr>
                            ) : customers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No players found in the database.
                                    </td>
                                </tr>
                            ) : (
                                customers.map((player) => (
                                    <tr key={player.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                                        <td className="p-4 font-bold text-foreground">{player.username}</td>
                                        <td className="p-4 text-muted-foreground">{player.email}</td>
                                        <td className="p-4 text-center">
                                            <span className="px-2 py-1 rounded bg-neon-purple/20 text-neon-purple text-xs font-bold">
                                                Lv {player.level}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right tabular-nums text-neon-green">
                                            {currency}{player.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-4 text-center text-muted-foreground tabular-nums">
                                            {player.total_transactions}
                                        </td>
                                        <td className="p-4 text-right text-xs text-muted-foreground">
                                            {new Date(player.joined_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.section>
            </div>
        </div>
    );
};

export default Admin;
