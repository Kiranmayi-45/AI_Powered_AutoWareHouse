
import React from 'react';
import { 
  Package, 
  BarChart, 
  Archive, 
  Search, 
  Settings, 
  Database,
  Home,
  ShoppingCart,
  Barcode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SidebarLinkProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ 
  icon, 
  label, 
  isActive = false,
  onClick 
}) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 mb-1 py-2",
        isActive ? "bg-sidebar-accent text-primary" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary"
      )}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
};

type SidebarProps = {
  activePage: string;
  onNavigate: (page: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate }) => {
  return (
    <div className="h-[calc(100vh-4rem)] w-56 bg-sidebar py-4 px-2 flex flex-col">
      <div className="flex-1 flex flex-col">
        <h2 className="text-xs uppercase text-muted-foreground font-semibold mb-4 px-2">Main</h2>
        <nav className="space-y-1">
          <SidebarLink 
            icon={<Home className="h-4 w-4" />} 
            label="Dashboard" 
            isActive={activePage === 'dashboard'}
            onClick={() => onNavigate('dashboard')}
          />
          <SidebarLink 
            icon={<Package className="h-4 w-4" />} 
            label="Inventory" 
            isActive={activePage === 'inventory'}
            onClick={() => onNavigate('inventory')}
          />
          <SidebarLink 
            icon={<Archive className="h-4 w-4" />} 
            label="Warehouse" 
            isActive={activePage === 'warehouse'}
            onClick={() => onNavigate('warehouse')}
          />
          <SidebarLink 
            icon={<ShoppingCart className="h-4 w-4" />} 
            label="Purchasing" 
            isActive={activePage === 'purchasing'}
            onClick={() => onNavigate('purchasing')}
          />
          <SidebarLink 
            icon={<Search className="h-4 w-4" />} 
            label="AI Recognition" 
            isActive={activePage === 'recognition'}
            onClick={() => onNavigate('recognition')}
          />
          <SidebarLink 
            icon={<Barcode className="h-4 w-4" />} 
            label="Barcode Scanner" 
            isActive={activePage === 'barcode'}
            onClick={() => onNavigate('barcode')}
          />
          <SidebarLink 
            icon={<BarChart className="h-4 w-4" />} 
            label="Analytics" 
            isActive={activePage === 'analytics'}
            onClick={() => onNavigate('analytics')}
          />
        </nav>

        {/* <h2 className="text-xs uppercase text-muted-foreground font-semibold mb-4 mt-8 px-2">System</h2>
        <nav className="space-y-1">
          <SidebarLink icon={<Settings className="h-4 w-4" />} label="Settings" />
          <SidebarLink icon={<Database className="h-4 w-4" />} label="Data Manager" />
        </nav> */}
      </div>

      {/* <div className="border-t border-border pt-4 mt-2">
        <div className="px-2">
          <div className="bg-sidebar-accent rounded-md p-3 text-center">
            <p className="text-xs text-sidebar-foreground mb-2">Smart Warehouse Simulator</p>
            <p className="text-xs text-muted-foreground">Version 1.0</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
