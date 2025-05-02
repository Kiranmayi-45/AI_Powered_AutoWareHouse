
// import React, { useState, useEffect } from 'react';
// import { useInventory } from '@/contexts/InventoryContext';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import WarehouseHeatmap from './WarehouseHeatmap';

// type ShelfItemProps = {
//   active: boolean;
//   lowStock?: boolean;
//   className?: string;
// };

// const ShelfItem: React.FC<ShelfItemProps> = ({ active, lowStock, className }) => {
//   if (!active) return null;
  
//   return (
//     <div 
//       className={`warehouse-item ${lowStock ? 'warehouse-item-low' : ''} ${className || ''}`}
//     ></div>
//   );
// };

// type ShelfProps = {
//   id: string;
//   items: number;
//   capacity: number;
//   lowStock?: boolean;
//   isActive?: boolean;
//   onSelect?: (id: string) => void;
// };

// const Shelf: React.FC<ShelfProps> = ({ 
//   id, 
//   items, 
//   capacity, 
//   lowStock = false,
//   isActive = false, 
//   onSelect 
// }) => {
//   // Calculate how many item slots to render (max 5)
//   const displayItems = Math.min(capacity, 5);
//   const activeItems = Math.min(items, displayItems);
  
//   return (
//     <div 
//       className={`warehouse-shelf ${isActive ? 'ring-2 ring-primary' : ''}`}
//       onClick={() => onSelect && onSelect(id)}
//     >
//       <div className="w-full space-y-1">
//         {Array.from({ length: displayItems }).map((_, i) => (
//           <ShelfItem 
//             key={i} 
//             active={i < activeItems} 
//             lowStock={lowStock && i < activeItems} 
//           />
//         ))}
//       </div>
//       <div className="text-xs text-white mt-1 font-mono">
//         {items}/{capacity}
//       </div>
//     </div>
//   );
// };

// type RobotProps = {
//   x: number;
//   y: number;
// };

// const Robot: React.FC<RobotProps> = ({ x, y }) => {
//   return (
//     <div 
//       className="absolute z-10 w-4 h-4 rounded-full bg-primary shadow-md animate-pulse-gentle transition-all duration-500"
//       style={{ 
//         left: `${x}%`, 
//         top: `${y}%`, 
//         transform: 'translate(-50%, -50%)' 
//       }}
//     ></div>
//   );
// };

// type WarehouseSimulationProps = {
//   simulateOperation?: boolean;
// };

// const WarehouseSimulation: React.FC<WarehouseSimulationProps> = ({ 
//   simulateOperation = false 
// }) => {
//   const { inventory } = useInventory();
//   const [activeShelf, setActiveShelf] = useState<string | null>(null);
//   const [robotPosition, setRobotPosition] = useState({ x: 50, y: 90 });
//   const [isSimulating, setIsSimulating] = useState(false);
//   const [activeTab, setActiveTab] = useState<string>('classic');

//   // Map inventory to warehouse shelves
//   const shelves = [
//     { id: 'A-1', capacity: 60, items: 45, lowStock: false },
//     { id: 'A-2', capacity: 80, items: 78, lowStock: false },
//     { id: 'A-3', capacity: 50, items: 32, lowStock: false },
//     { id: 'B-1', capacity: 30, items: 20, lowStock: false },
//     { id: 'B-2', capacity: 20, items: 5, lowStock: true },
//     { id: 'B-3', capacity: 30, items: 12, lowStock: true },
//     { id: 'B-4', capacity: 40, items: 8, lowStock: true },
//     { id: 'C-1', capacity: 150, items: 150, lowStock: false },
//     { id: 'C-2', capacity: 100, items: 95, lowStock: true },
//     { id: 'C-3', capacity: 70, items: 55, lowStock: false },
//     { id: 'C-4', capacity: 90, items: 76, lowStock: false },
//     { id: 'D-1', capacity: 110, items: 87, lowStock: false },
//   ];

//   // Find the x, y position of a shelf by its id
//   const getShelfPosition = (shelfId: string) => {
//     const index = shelves.findIndex(shelf => shelf.id === shelfId);
//     if (index === -1) return { x: 50, y: 50 };
    
//     const row = Math.floor(index / 4);
//     const col = index % 4;
    
//     return {
//       x: 12.5 + col * 25,
//       y: 20 + row * 30
//     };
//   };

//   const simulateRobotMovement = () => {
//     if (!activeShelf) return;
    
//     setIsSimulating(true);
    
//     // Get target position
//     const targetPos = getShelfPosition(activeShelf);
    
//     // Move robot to shelf
//     setTimeout(() => {
//       setRobotPosition({ x: targetPos.x, y: targetPos.y });
//     }, 500);
    
//     // Return robot to base after a delay
//     setTimeout(() => {
//       setRobotPosition({ x: 50, y: 90 });
//       setIsSimulating(false);
//     }, 3000);
//   };

//   return (
//     <div className="space-y-6 p-6 animate-fade-in">
//       <Tabs defaultValue="classic" value={activeTab} onValueChange={setActiveTab}>
//         <TabsList className="grid grid-cols-2 w-[400px] mb-4">
//           <TabsTrigger value="classic">Classic View</TabsTrigger>
//           <TabsTrigger value="heatmap">Heatmap View</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="classic" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <div className="flex justify-between items-center">
//                 <CardTitle>Warehouse Simulation</CardTitle>
//                 <div className="flex items-center space-x-2">
//                   <Button 
//                     variant="secondary" 
//                     size="sm" 
//                     disabled={!activeShelf || isSimulating}
//                     onClick={simulateRobotMovement}
//                   >
//                     Simulate Robot Retrieval
//                   </Button>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="relative h-96 bg-warehouse-floor rounded-lg p-4">
//                 <div className="warehouse-grid grid-cols-4 grid-rows-3 h-full">
//                   {shelves.map((shelf) => (
//                     <Shelf 
//                       key={shelf.id}
//                       id={shelf.id}
//                       items={shelf.items}
//                       capacity={shelf.capacity}
//                       lowStock={shelf.lowStock}
//                       isActive={activeShelf === shelf.id}
//                       onSelect={setActiveShelf}
//                     />
//                   ))}
//                 </div>
                
//                 <Robot x={robotPosition.x} y={robotPosition.y} />
                
//                 {/* Robot base */}
//                 <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-muted rounded-md flex items-center justify-center">
//                   <span className="text-xs text-muted-foreground">Base</span>
//                 </div>
//               </div>
              
//               <div className="mt-4 flex items-center justify-between">
//                 <div>
//                   {activeShelf ? (
//                     <div className="text-sm">
//                       <span className="font-medium">Selected: </span>
//                       <span>{activeShelf}</span>
//                     </div>
//                   ) : (
//                     <div className="text-sm text-muted-foreground">
//                       Select a shelf to interact
//                     </div>
//                   )}
//                 </div>
                
//                 <div className="flex items-center space-x-4 text-sm">
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-warehouse-shelf rounded mr-1"></div>
//                     <span className="text-muted-foreground">Shelf</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-warehouse-item rounded mr-1"></div>
//                     <span className="text-muted-foreground">Item</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-3 h-3 bg-warehouse-lowStock rounded mr-1"></div>
//                     <span className="text-muted-foreground">Low Stock</span>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Warehouse Layout</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Total Shelves:</span>
//                     <span className="font-medium">12</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Total Capacity:</span>
//                     <span className="font-medium">830 units</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Currently Stored:</span>
//                     <span className="font-medium">663 units</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Space Utilization:</span>
//                     <span className="font-medium">79.8%</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle>Robot Status</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Status:</span>
//                     <span className={`font-medium ${isSimulating ? 'text-primary' : 'text-muted-foreground'}`}>
//                       {isSimulating ? 'In Operation' : 'Idle'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Battery:</span>
//                     <span className="font-medium">87%</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Last Operation:</span>
//                     <span className="text-muted-foreground">Item Retrieval - 5m ago</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Operations Today:</span>
//                     <span className="font-medium">24</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
        
//         <TabsContent value="heatmap">
//           <WarehouseHeatmap />
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Heatmap Analysis</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">High-Traffic Shelves:</span>
//                     <span className="font-medium">4</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Low-Traffic Shelves:</span>
//                     <span className="font-medium">7</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Avg. Pick Rate:</span>
//                     <span className="font-medium">38 picks/day</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm">Optimization Score:</span>
//                     <span className="font-medium">72%</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
            
//             <Card>
//               <CardHeader>
//                 <CardTitle>Optimization Suggestions</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="p-3 border border-border rounded-md">
//                     <p className="font-medium">Move high-traffic shelves closer to loading bay</p>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       Shelves A-2, C-1 should be repositioned to reduce travel distance.
//                     </p>
//                   </div>
                  
//                   <div className="p-3 border border-border rounded-md">
//                     <p className="font-medium">Redistribute frequently accessed products</p>
//                     <p className="text-sm text-muted-foreground mt-1">
//                       Consider placing desk lamps with office chairs to optimize picking route.
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default WarehouseSimulation;

import React from 'react';
import { Card } from '@/components/ui/card';
import WarehouseHeatmap from './WarehouseHeatmap';

const WarehouseView: React.FC = () => {
  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <WarehouseHeatmap />
    </div>
  );
};

export default WarehouseView;