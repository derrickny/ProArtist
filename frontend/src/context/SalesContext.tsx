'use client';

import React, { createContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface SaleItem {
    id: string;
    type: string; // 'service', 'product', etc.
    serviceId?: string;
    productId?: string;
    staffId?: string;
    price: number;
    quantity: number;
    discount: number;
    total: number;
}

interface Customer {
    id: string;
    name: string;
    mobile?: string;
    email?: string;
    locationId?: string;
}

interface SaleDetails {
    items: SaleItem[];
    customer: Customer | null;
    total: number;
}

export const SaleContext = createContext<SaleContextType | undefined>(undefined);

interface SaleContextType {
    saleDetails: SaleDetails;
    addSaleItem: (item: SaleItem) => void;
    removeSaleItem: (itemId: string) => void;
    updateSaleItem: (itemId: string, updates: Partial<SaleItem>) => void;
    setCustomer: (customer: Customer) => void;
    clearSale: () => void;
    finalizeSale: () => Promise<void>;
}

export const SaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [saleDetails, setSaleDetails] = useState<SaleDetails>({ items: [], customer: null, total: 0 });

const addSaleItem = (item: SaleItem) => {
    setSaleDetails(prevDetails => {
        const existingItemIndex = prevDetails.items.findIndex(i => i.id === item.id);
        let newItems;
        if (existingItemIndex > -1) {
            // If the item already exists, update the quantity and total
            newItems = [...prevDetails.items];
            newItems[existingItemIndex].quantity += item.quantity;
            newItems[existingItemIndex].total = newItems[existingItemIndex].price * newItems[existingItemIndex].quantity;
        } else {
            // If the item does not exist, add it to the items
            newItems = [...prevDetails.items, item];
        }
        const newTotal = newItems.reduce((acc, curr) => acc + curr.total, 0);
        return {
            ...prevDetails,
            items: newItems,
            total: newTotal,
        };
    });
};

const removeSaleItem = (itemId: string) => {
    setSaleDetails(prevDetails => {
        const updatedItems = prevDetails.items.filter(item => item.id !== itemId);
        const newTotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
        return {
            ...prevDetails,
            items: updatedItems,
            total: newTotal,
        };
    });
};

const updateSaleItem = (itemId: string, updates: Partial<SaleItem>) => {
    setSaleDetails(prevDetails => {
        const updatedItems = prevDetails.items.map(item => {
            if (item.id === itemId) {
                let newPrice = updates.price !== undefined ? updates.price : item.price;
                return {
                    ...item,
                    ...updates,
                    price: newPrice,
                    total: newPrice * (updates.quantity || item.quantity)
                };
            }
            return item;
        });
        const newTotal = updatedItems.reduce((acc, curr) => acc + curr.total, 0);
        return {
            ...prevDetails,
            items: updatedItems,
            total: newTotal,
        };
    });
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

    const finalizeSale = async () => {
        const { items, customer } = saleDetails;
        if (!customer) throw new Error("A customer must be selected to finalize the sale.");

        const response = await axios.post('/sales', {
            customer: customer.id,
            saleItems: items.map(({ serviceId, productId, quantity, price }) => ({
                service: serviceId,
                product: productId,
                quantity,
                price_per_unit: price,
                discount: 0, // Adjust according to your needs
                total_price: quantity * price // This might be adjusted backend-side
            })),
        });

        return response.data; // handle response or errors accordingly
    };

    return (
        <SaleContext.Provider value={{ saleDetails, addSaleItem, removeSaleItem, updateSaleItem, setCustomer, clearSale, finalizeSale }}>
            {children}
        </SaleContext.Provider>
    );
};