
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const atRiskData = [
  { name: 'Clothes', value: 120, category: 'Dressing' },
  { name: 'Bottles', value: 98, category: 'Homeware' },
  { name: 'Watches', value: 86, category: 'Accessories' },
  { name: 'Belts', value: 65, category: 'Accessories' },
  { name: 'Computer', value: 58, category: 'Electronics' },
];

const categoryDwellData = [
  { name: 'Electronics', value: 20 },
  { name: 'Accessories', value: 28 },
  { name: 'Dressing', value: 45 },
  { name: 'Homewear', value: 32 },
];

const DwellTimePanel: React.FC = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [zone, setZone] = useState('all');
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>Dwell Time analysis</CardTitle>
            {/* <div className="flex items-center gap-2">
              <div className="flex rounded-md border border-input overflow-hidden">
                <Button 
                  variant={dateRange === "7d" ? "default" : "ghost"} 
                  className="rounded-none h-8 px-3 text-xs"
                  onClick={() => setDateRange("7d")}
                >
                  7D
                </Button>
                <Button 
                  variant={dateRange === "30d" ? "default" : "ghost"} 
                  className="rounded-none h-8 px-3 text-xs border-l border-r border-input"
                  onClick={() => setDateRange("30d")}
                >
                  30D
                </Button>
                <Button 
                  variant={dateRange === "90d" ? "default" : "ghost"} 
                  className="rounded-none h-8 px-3 text-xs"
                  onClick={() => setDateRange("90d")}
                >
                  90D
                </Button>
              </div>
              
              <Select value={zone} onValueChange={setZone}>
                <SelectTrigger className="w-[130px] h-8">
                  <SelectValue placeholder="All Zones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Zones</SelectItem>
                  <SelectItem value="zone-a">Zone A</SelectItem>
                  <SelectItem value="zone-b">Zone B</SelectItem>
                  <SelectItem value="zone-c">Zone C</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">At-Risk Stock Products</CardTitle>
            <p className="text-xs text-muted-foreground">Dwell time exceeds threshold (days)</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={atRiskData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" tick={{ fill: 'currentColor' }} />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fill: 'currentColor' }}
                    width={100}
                    style={{
                      fontSize: '12px',
                    }}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => {
                      return [`${value} days`, 'Dwell Time'];
                    }}
                    labelFormatter={(value) => `Product: ${value}`}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--destructive))" 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Average Dwell Time by Category</CardTitle>
            <p className="text-xs text-muted-foreground">Average days by product category</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={categoryDwellData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'currentColor' }} />
                  <YAxis tick={{ fill: 'currentColor' }} />
                  <Tooltip
                    formatter={(value) => [`${value} days`, 'Avg. Dwell Time']}
                    labelFormatter={(value) => `Category: ${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DwellTimePanel;
