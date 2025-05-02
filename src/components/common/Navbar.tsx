
import React, { useState } from 'react';
import { Search, Package, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-card border-b border-border h-16 py-2 px-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center">
          <Package className="h-6 w-6 text-primary mr-2" />
          <h1 className="text-xl font-bold">AutoWare</h1>
        </div>
      </div>
      
      <div className="flex-1 mx-6 max-w-md">
        <div className="relative">
          {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search inventory..."
            className="pl-8 bg-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          /> */}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <ThemeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <h4 className="font-medium">Notifications</h4>
              <Button variant="ghost" size="sm">Mark all as read</Button>
            </div>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <p className="font-medium">Low stock alert: Desk Lamp</p>
                <p className="text-sm text-muted-foreground">Quantity below threshold of 10</p>
                <p className="text-xs text-muted-foreground mt-1">5 minutes ago</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <div className="flex flex-col gap-1">
                <p className="font-medium">AI Restock Suggestion</p>
                <p className="text-sm text-muted-foreground">Order 110 units of Printer Paper</p>
                <p className="text-xs text-muted-foreground mt-1">30 minutes ago</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-medium text-sm">AW</span>
          </div>
          <span className="hidden sm:inline-block font-medium">Admin</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
