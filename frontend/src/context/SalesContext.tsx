// SaleContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SaleItem {
    id: string;
    type: string;
    price: number;
}

interface Customer {
    id: string;
    name: string;
}

interface SaleDetails {
    items: SaleItem[];
    customer: Customer | null;
    total: number;
}

interface SaleContextType {
    saleDetails: SaleDetails;
    addSaleItem: (item: SaleItem) => void;
    setCustomer: (customer: Customer) => void;
    clearSale: () => void;
}

const SaleContext = createContext<SaleContextType | undefined>(undefined);

export const useSale = () => {
    const context = useContext(SaleContext);
    if (!context) {
        throw new Error('useSale must be used within a SaleProvider');
    }
    return context;
};

export const SaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [saleDetails, setSaleDetails] = useState<SaleDetails>({ items: [], customer: null, total: 0 });

    const addSaleItem = (item: SaleItem) => {
        setSaleDetails(prevDetails => ({
            ...prevDetails,
            items: [...prevDetails.items, item],
            total: prevDetails.total + item.price,
        }));
    };

    const setCustomer = (customer: Customer) => {
        setSaleDetails(prevDetails => ({
            ...prevDetails,
            customer,
        }));
    };

    const clearSale = () => {
        setSaleDetails({ items: [], customer: null, total: 0 });
    };

    return (
        <SaleContext.Provider value={{ saleDetails, addSaleItem, setCustomer, clearSale }}>
            {children}
        </SaleContext.Provider>
    );
};