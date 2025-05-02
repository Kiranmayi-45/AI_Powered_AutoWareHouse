
import React, { useState } from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import Chatbot from '../chatbot/Chatbot';
import { InventoryProvider } from '@/contexts/InventoryContext';
import Dashboard from '../dashboard/Dashboard';
import InventoryManager from '../inventory/InventoryManager';
import WarehouseSimulation from '../warehouse/WarehouseSimulation';
import ObjectRecognition from '../ai/ObjectRecognition';
import ReorderManager from '../purchasing/ReorderManager';
import { Card } from '@/components/ui/card';
import  SalesAnalytics from '../charts/SalesAnalytics';
import StockBarGraph from '../analytics/StockBarGraph';
import BarcodeScanner from '../ai/BarcodeScanner';


type PageType = 'dashboard' | 'inventory' | 'warehouse' | 'recognition' | 'analytics' | 'purchasing' | 'barcode';

const AppLayout: React.FC = () => {
  const [activePage, setActivePage] = useState<PageType>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <InventoryManager />;
      case 'warehouse':
        return <WarehouseSimulation />;
      case 'recognition':
        return <ObjectRecognition />;
      case 'purchasing':
        return <ReorderManager />;
        case 'analytics':
        return <SalesAnalytics />;
      case 'barcode':
        return <BarcodeScanner />;
        
      default:
        return <Dashboard />;
    }
  };

  return (
    <InventoryProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            activePage={activePage} 
            onNavigate={(page) => setActivePage(page as PageType)} 
          />
          <main className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
        <Chatbot />
      </div>
    </InventoryProvider>
  );
};

export default AppLayout;
