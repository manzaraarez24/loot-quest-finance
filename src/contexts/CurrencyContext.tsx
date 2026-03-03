import React, { createContext, useContext, useState, useEffect } from 'react';

type Currency = '$' | '€' | '£' | '¥' | '₹';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<Currency>(() => {
        const saved = localStorage.getItem('loot_quest_currency');
        return (saved as Currency) || '$';
    });

    const setCurrency = (newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('loot_quest_currency', newCurrency);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
