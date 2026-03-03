import { useCurrency } from '@/contexts/CurrencyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const currencies = [
    { value: '$', label: 'USD ($)' },
    { value: '€', label: 'EUR (€)' },
    { value: '£', label: 'GBP (£)' },
    { value: '¥', label: 'JPY (¥)' },
    { value: '₹', label: 'INR (₹)' },
];

export function CurrencySelector() {
    const { currency, setCurrency } = useCurrency();

    return (
        <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
            <SelectTrigger className="w-[110px] bg-muted/50 border-border/50 text-xs h-8">
                <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
                {currencies.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                        {c.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
