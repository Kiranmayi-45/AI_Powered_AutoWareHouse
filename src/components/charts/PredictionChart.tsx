
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useInventory } from '@/contexts/InventoryContext';

// Sample historical and prediction data
const generateHistoricalData = () => {
  // Generate the last 5 weeks of data plus 4 weeks of prediction
  const data = [];
  const now = new Date();
  const currentMonth = now.getMonth();
  
  for (let i = -5; i <= 4; i++) {
    const date = new Date();
    date.setDate(date.getDate() + (i * 7));
    
    // Historical data for past weeks
    if (i <= 0) {
      data.push({
        name: `Week ${i + 6}`,
        actual: Math.floor(Math.random() * 50) + 150,
        predicted: null,
        isPrediction: false
      });
    } 
    // Future predictions
    else {
      const lastActual = data[data.length - 1].actual;
      const predicted = Math.floor(lastActual * (0.9 + Math.random() * 0.3));
      
      data.push({
        name: `Week ${i + 6}`,
        actual: null,
        predicted,
        isPrediction: true
      });
    }
  }
  
  return data;
};

const PredictionChart: React.FC = () => {
  const { getLowStockItems } = useInventory();
  const data = generateHistoricalData();
  
  // Get a low stock item for the prediction example
  const lowStockItems = getLowStockItems();
  const exampleItem = lowStockItems.length > 0 ? lowStockItems[0].name : "Desk Lamp";
  
  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPrediction = payload[0].payload.isPrediction;
      
      return (
        <div className="bg-card p-3 border border-border rounded-md shadow-md">
          <p className="font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => {
            if (entry.value !== null) {
              return (
                <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
                  {`${entry.name}: ${entry.value} units`}
                </p>
              );
            }
            return null;
          })}
          {isPrediction && (
            <p className="text-xs text-muted-foreground mt-1">
              AI Confidence: 87%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Demand Forecasting: {exampleItem}</h3>
        <div className="flex items-center text-xs">
          <span className="h-3 w-3 rounded-full bg-primary mr-1"></span>
          <span className="mr-3 text-muted-foreground">Actual</span>
          <span className="h-3 w-3 rounded-full bg-secondary mr-1"></span>
          <span className="text-muted-foreground">Predicted</span>
        </div>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" tick={{ fill: '#9CA3AF' }} />
            <YAxis tick={{ fill: '#9CA3AF' }} />
            <Tooltip content={renderCustomTooltip} />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#9b87f5" 
              strokeWidth={2} 
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }}
              connectNulls 
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#7E69AB" 
              strokeWidth={2} 
              strokeDasharray="5 5"
              dot={{ r: 4 }} 
              activeDot={{ r: 6 }}
              connectNulls 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PredictionChart;
