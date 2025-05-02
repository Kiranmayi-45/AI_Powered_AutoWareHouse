
import React, { useState } from 'react';
import { useInventory } from '@/contexts/InventoryContext';
import InventoryChart from '../charts/InventoryChart';
import PredictionChart from '../charts/PredictionChart';
import DwellTimePanel from './DwellTimePanel';
import DemandTrends from './DemandTrends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, BarChart, Box, Boxes, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}> = ({ title, value, description, icon, trend }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div className="flex items-center mt-2">
            <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const { 
    inventory, 
    totalItems, 
    totalCategories, 
    getLowStockItems, 
    lowStockPercentage 
  } = useInventory();
  
  const [activeTab, setActiveTab] = useState<string>('overview');
  const lowStockItems = getLowStockItems();
  
  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Total Inventory"
          value={totalItems()}
          description="Items in stock"
          icon={<Boxes className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Categories"
          value={totalCategories()}
          description="Product categories"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockItems.length}
          description="Items below threshold"
          icon={<AlertTriangle className="h-4 w-4 text-warehouse-lowStock" />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard
          title="Average Dwell Time"
          value="28 days"
          description="Time before picking"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 3, isPositive: false }}
        />
        <StatsCard
          title="Space Utilization"
          value="68%"
          description="Warehouse capacity used"
          icon={<Box className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 3, isPositive: true }}
        />
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px] mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="dwell-time">Dwell Time</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <InventoryChart />
              </CardContent>
            </Card>
            <DemandTrends />
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockItems.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockItems.map((item) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Location: {item.location}</p>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} / {item.threshold}
                          </div>
                        </div>
                        <Progress 
                          value={(item.quantity / item.threshold) * 100} 
                          className={item.quantity < item.threshold * 0.5 ? 'bg-destructive/25' : 'bg-orange-500/25'} 
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <p className="text-muted-foreground">No low stock items</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>AI Restock Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start justify-between p-3 border border-border rounded-md">
                    <div>
                      <p className="font-medium">Printer Paper</p>
                      <p className="text-sm text-muted-foreground mt-1">Current: 95, Threshold: 100</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">Order 110 units</p>
                      <p className="text-xs text-muted-foreground">78% confidence</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between p-3 border border-border rounded-md">
                    <div>
                      <p className="font-medium">Desk Lamp</p>
                      <p className="text-sm text-muted-foreground mt-1">Current: 8, Threshold: 10</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">Order 14 units</p>
                      <p className="text-xs text-muted-foreground">92% confidence</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between p-3 border border-border rounded-md">
                    <div>
                      <p className="font-medium">Standing Desk</p>
                      <p className="text-sm text-muted-foreground mt-1">Current: 5, Threshold: 8</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">Order 10 units</p>
                      <p className="text-xs text-muted-foreground">89% confidence</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="dwell-time">
          <DwellTimePanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
