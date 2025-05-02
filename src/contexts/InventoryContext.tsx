import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/firebase';

// ========== Types ==========
export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  threshold: number;
  lastRestocked?: Date;
  //image?: string;
};

export type StockPrediction = {
  itemId: string;
  predictedDemand: number;
  suggestedRestock: number;
  confidence: number;
};

type InventoryContextType = {
  inventory: InventoryItem[];
  predictions: StockPrediction[];
  addItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<InventoryItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  getItemById: (id: string) => InventoryItem | undefined;
  getLowStockItems: () => InventoryItem[];
  getItemsByCategory: (category: string) => InventoryItem[];
  totalItems: () => number;
  totalCategories: () => number;
  lowStockPercentage: () => number;
};

// ========== Context ==========
const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// ========== Predictions (static) ==========
const initialPredictions: StockPrediction[] = [
  { itemId: '1', predictedDemand: 30, suggestedRestock: 15, confidence: 0.85 },
  { itemId: '5', predictedDemand: 12, suggestedRestock: 14, confidence: 0.92 },
  { itemId: '7', predictedDemand: 105, suggestedRestock: 110, confidence: 0.78 },
  { itemId: '8', predictedDemand: 7, suggestedRestock: 10, confidence: 0.89 }
];

// ========== Provider ==========
export const InventoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [predictions] = useState<StockPrediction[]>(initialPredictions);

  // Realtime sync
  useEffect(() => {
    const fetchInventory = async () => {
      const { data, error } = await supabase.from('inventory').select('*');
      if (error) {
        console.error('Supabase fetch error:', error);
        setInventory([]);
        return;
      }
      if (data) setInventory(data);
    };
    fetchInventory();
  }, []);

  // ========== CRUD ==========
  const addItem = async (item: Omit<InventoryItem, 'id'>) => {
    const { data, error } = await supabase.from('inventory').insert([item]).select();
    if (error) {
      console.error(error);
      return;
    }
    if (data) setInventory(prev => [...prev, ...data]);
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) {
      console.error(error);
      return;
    }
    if (data) setInventory(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase.from('inventory').delete().eq('id', id);
    if (!error) setInventory(prev => prev.filter(item => item.id !== id));
  };

  // ========== Utility Methods ==========
  const getItemById = (id: string) => inventory.find(item => item.id === id);
  const getLowStockItems = () => inventory.filter(item => item.quantity <= item.threshold);
  const getItemsByCategory = (category: string) => inventory.filter(item => item.category === category);
  const totalItems = () => inventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalCategories = () => new Set(inventory.map(item => item.category)).size;
  const lowStockPercentage = () => {
    const low = getLowStockItems().length;
    return inventory.length ? (low / inventory.length) * 100 : 0;
  };

  // ========== Provide ==========
  const value: InventoryContextType = {
    inventory,
    predictions,
    addItem,
    updateItem,
    removeItem,
    getItemById,
    getLowStockItems,
    getItemsByCategory,
    totalItems,
    totalCategories,
    lowStockPercentage
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

// ========== Hook ==========
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
