
// import React, { useState } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Check, ChevronsUpDown } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from '@/components/ui/command';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// // Sample product data
// const products = [
//   { value: 'desk-lamp', label: 'Desk Lamp' },
//   { value: 'office-chair', label: 'Office Chair' },
//   { value: 'monitor-stand', label: 'Monitor Stand' },
//   { value: 'keyboard', label: 'Keyboard' },
//   { value: 'mouse', label: 'Mouse' },
//   { value: 'headphones', label: 'Headphones' },
// ];

// // Sample categories
// const categories = [
//   { value: 'furniture', label: 'Furniture' },
//   { value: 'electronics', label: 'Electronics' },
//   { value: 'office-supplies', label: 'Office Supplies' },
//   { value: 'kitchen', label: 'Kitchen' },
// ];

// // Sample data for different time ranges
// const generateData = (days: number, selectedItems: string[]) => {
//   const data = [];
//   const now = new Date();
//   const multipliers: Record<string, number> = {
//     'desk-lamp': 1.2,
//     'office-chair': 0.8,
//     'monitor-stand': 0.5,
//     'keyboard': 1.5,
//     'mouse': 1.3,
//     'headphones': 0.7,
//     'furniture': 1.1,
//     'electronics': 1.4,
//     'office-supplies': 0.9,
//     'kitchen': 0.6,
//   };
  
//   for (let i = days; i >= 0; i--) {
//     const date = new Date(now);
//     date.setDate(date.getDate() - i);
    
//     const entry: Record<string, any> = {
//       date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//     };
    
//     selectedItems.forEach(item => {
//       const baseValue = 50 + Math.sin(i * 0.5) * 20;
//       const multiplier = multipliers[item] || 1;
//       entry[item] = Math.round(baseValue * multiplier);
//     });
    
//     data.push(entry);
//   }
  
//   return data;
// };

// const DemandTrends: React.FC = () => {
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [openProducts, setOpenProducts] = useState(false);
//   const [openCategories, setOpenCategories] = useState(false);
//   const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  
//   const handleProductSelect = (value: string) => {
//     setSelectedProducts(current => 
//       current.includes(value) 
//         ? current.filter(item => item !== value)
//         : [...current, value]
//     );
//   };
  
//   const handleCategorySelect = (value: string) => {
//     setSelectedCategories(current => 
//       current.includes(value) 
//         ? current.filter(item => item !== value)
//         : [...current, value]
//     );
//   };
  
//   const allSelected = [...selectedProducts, ...selectedCategories];
  
//   // Generate chart data based on selections
//   const chartData = allSelected.length > 0 
//     ? generateData(dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90, allSelected)
//     : [];
    
//   const colors = [
//     '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F', 
//     '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
//   ];
  
//   return (
//     <Card className="col-span-2">
//       <CardHeader className="pb-2">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <CardTitle>Demand Trends</CardTitle>
//           <div className="flex items-center gap-2">
//             <div className="flex rounded-md border border-input overflow-hidden">
//               <Button 
//                 variant={dateRange === "7d" ? "default" : "ghost"} 
//                 className="rounded-none h-8 px-3 text-xs"
//                 onClick={() => setDateRange("7d")}
//               >
//                 7D
//               </Button>
//               <Button 
//                 variant={dateRange === "30d" ? "default" : "ghost"} 
//                 className="rounded-none h-8 px-3 text-xs border-l border-r border-input"
//                 onClick={() => setDateRange("30d")}
//               >
//                 30D
//               </Button>
//               <Button 
//                 variant={dateRange === "90d" ? "default" : "ghost"} 
//                 className="rounded-none h-8 px-3 text-xs"
//                 onClick={() => setDateRange("90d")}
//               >
//                 90D
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <div className="flex-1">
//             <label className="text-sm font-medium mb-1 block">Select Products</label>
//             <Popover open={openProducts} onOpenChange={setOpenProducts}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   aria-expanded={openProducts}
//                   className="w-full justify-between"
//                 >
//                   {selectedProducts.length > 0
//                     ? `${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected`
//                     : "Select products..."}
//                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-full p-0" align="start">
//                 <Command>
//                   <CommandInput placeholder="Search products..." />
//                   <CommandEmpty>No product found.</CommandEmpty>
//                   <CommandGroup>
//                     {products.map((product) => (
//                       <CommandItem
//                         key={product.value}
//                         value={product.value}
//                         onSelect={() => handleProductSelect(product.value)}
//                       >
//                         <Check
//                           className={cn(
//                             "mr-2 h-4 w-4",
//                             selectedProducts.includes(product.value) ? "opacity-100" : "opacity-0"
//                           )}
//                         />
//                         {product.label}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>
          
//           <div className="flex-1">
//             <label className="text-sm font-medium mb-1 block">Select Categories</label>
//             <Popover open={openCategories} onOpenChange={setOpenCategories}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   aria-expanded={openCategories}
//                   className="w-full justify-between"
//                 >
//                   {selectedCategories.length > 0
//                     ? `${selectedCategories.length} ${selectedCategories.length > 1 ? 'categories' : 'category'} selected`
//                     : "Select categories..."}
//                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-full p-0" align="start">
//                 <Command>
//                   <CommandInput placeholder="Search categories..." />
//                   <CommandEmpty>No category found.</CommandEmpty>
//                   <CommandGroup>
//                     {categories.map((category) => (
//                       <CommandItem
//                         key={category.value}
//                         value={category.value}
//                         onSelect={() => handleCategorySelect(category.value)}
//                       >
//                         <Check
//                           className={cn(
//                             "mr-2 h-4 w-4",
//                             selectedCategories.includes(category.value) ? "opacity-100" : "opacity-0"
//                           )}
//                         />
//                         {category.label}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>
        
//         {allSelected.length > 0 ? (
//           <div className="h-64 mt-4">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={chartData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="date" tick={{ fill: 'currentColor' }} />
//                 <YAxis tick={{ fill: 'currentColor' }} />
//                 <Tooltip
//                   formatter={(value, name) => {
//                     const label = products.find(p => p.value === name)?.label || 
//                                  categories.find(c => c.value === name)?.label || 
//                                  name;
//                     return [`${value} units`, label];
//                   }}
//                 />
//                 {allSelected.map((item, index) => (
//                   <Line
//                     key={item}
//                     type="monotone"
//                     dataKey={item}
//                     stroke={colors[index % colors.length]}
//                     strokeWidth={2}
//                     dot={{ r: 3 }}
//                     activeDot={{ r: 5 }}
//                   />
//                 ))}
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         ) : (
//           <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-md">
//             <p className="text-muted-foreground">Select products or categories to view demand trends</p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default DemandTrends;

// import React, { useState } from 'react';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Check, ChevronsUpDown } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
// } from '@/components/ui/command';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts';

// // Sample product data
// const products = [
//   { value: 'desk-lamp', label: 'Desk Lamp' },
//   { value: 'office-chair', label: 'Office Chair' },
//   { value: 'monitor-stand', label: 'Monitor Stand' },
//   { value: 'keyboard', label: 'Keyboard' },
//   { value: 'mouse', label: 'Mouse' },
//   { value: 'headphones', label: 'Headphones' },
// ];

// // Sample categories
// const categories = [
//   { value: 'furniture', label: 'Furniture' },
//   { value: 'electronics', label: 'Electronics' },
//   { value: 'office-supplies', label: 'Office Supplies' },
//   { value: 'kitchen', label: 'Kitchen' },
// ];

// // Sample data for different time ranges
// const generateData = (days: number, selectedItems: string[]) => {
//   const data = [];
//   const now = new Date();
//   const multipliers: Record<string, number> = {
//     'desk-lamp': 1.2,
//     'office-chair': 0.8,
//     'monitor-stand': 0.5,
//     'keyboard': 1.5,
//     'mouse': 1.3,
//     'headphones': 0.7,
//     'furniture': 1.1,
//     'electronics': 1.4,
//     'office-supplies': 0.9,
//     'kitchen': 0.6,
//   };
  
//   for (let i = days; i >= 0; i--) {
//     const date = new Date(now);
//     date.setDate(date.getDate() - i);
    
//     const entry: Record<string, any> = {
//       date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
//     };
    
//     selectedItems.forEach(item => {
//       const baseValue = 50 + Math.sin(i * 0.5) * 20;
//       const multiplier = multipliers[item] || 1;
//       entry[item] = Math.round(baseValue * multiplier);
//     });
    
//     data.push(entry);
//   }
  
//   return data;
// };

// const DemandTrends: React.FC = () => {
//   const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [openProducts, setOpenProducts] = useState(false);
//   const [openCategories, setOpenCategories] = useState(false);
//   const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  
//   const handleProductSelect = (value: string) => {
//     setSelectedProducts(current => 
//       current.includes(value) 
//         ? current.filter(item => item !== value)
//         : [...current, value]
//     );
//   };
  
//   const handleCategorySelect = (value: string) => {
//     setSelectedCategories(current => 
//       current.includes(value) 
//         ? current.filter(item => item !== value)
//         : [...current, value]
//     );
//   };
  
//   const allSelected = [...selectedProducts, ...selectedCategories];
  
//   // Generate chart data based on selections
//   const chartData = allSelected.length > 0 
//     ? generateData(dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90, allSelected)
//     : [];
    
//   const colors = [
//     '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00C49F', 
//     '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
//   ];
  
//   return (
//     <Card className="col-span-2">
//       <CardHeader className="pb-2">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <CardTitle>Demand Trends</CardTitle>
//           <div className="flex items-center gap-2">
//             <div className="flex rounded-md border border-input overflow-hidden">
//               <Button 
//                 variant={dateRange === "7d" ? "default" : "ghost"} 
//                 className="rounded-none h-8 px-3 text-xs"
//                 onClick={() => setDateRange("7d")}
//               >
//                 7D
//               </Button>
//               <Button 
//                 variant={dateRange === "30d" ? "default" : "ghost"} 
//                 className="rounded-none h-8 px-3 text-xs border-l border-r border-input"
//                 onClick={() => setDateRange("30d")}
//               >
//                 30D
//               </Button>
//               <Button 
//                 variant={dateRange === "90d" ? "default" : "ghost"} 
//                 className="rounded-none h-8 px-3 text-xs"
//                 onClick={() => setDateRange("90d")}
//               >
//                 90D
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="pt-0">
//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <div className="flex-1">
//             <label className="text-sm font-medium mb-1 block">Select Products</label>
//             <Popover open={openProducts} onOpenChange={setOpenProducts}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   aria-expanded={openProducts}
//                   className="w-full justify-between"
//                 >
//                   {selectedProducts.length > 0
//                     ? ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected
//                     : "Select products..."}
//                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-full p-0" align="start">
//                 <Command>
//                   <CommandInput placeholder="Search products..." />
//                   <CommandEmpty>No product found.</CommandEmpty>
//                   <CommandGroup>
//                     {products.map((product) => (
//                       <CommandItem
//                         key={product.value}
//                         value={product.value}
//                         onSelect={() => handleProductSelect(product.value)}
//                       >
//                         <Check
//                           className={cn(
//                             "mr-2 h-4 w-4",
//                             selectedProducts.includes(product.value) ? "opacity-100" : "opacity-0"
//                           )}
//                         />
//                         {product.label}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>
          
//           <div className="flex-1">
//             <label className="text-sm font-medium mb-1 block">Select Categories</label>
//             <Popover open={openCategories} onOpenChange={setOpenCategories}>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant="outline"
//                   role="combobox"
//                   aria-expanded={openCategories}
//                   className="w-full justify-between"
//                 >
//                   {selectedCategories.length > 0
//                     ? ${selectedCategories.length} ${selectedCategories.length > 1 ? 'categories' : 'category'} selected
//                     : "Select categories..."}
//                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-full p-0" align="start">
//                 <Command>
//                   <CommandInput placeholder="Search categories..." />
//                   <CommandEmpty>No category found.</CommandEmpty>
//                   <CommandGroup>
//                     {categories.map((category) => (
//                       <CommandItem
//                         key={category.value}
//                         value={category.value}
//                         onSelect={() => handleCategorySelect(category.value)}
//                       >
//                         <Check
//                           className={cn(
//                             "mr-2 h-4 w-4",
//                             selectedCategories.includes(category.value) ? "opacity-100" : "opacity-0"
//                           )}
//                         />
//                         {category.label}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </Command>
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>
        
//         {allSelected.length > 0 ? (
//           <div className="h-64 mt-4">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart
//                 data={chartData}
//                 margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="date" tick={{ fill: 'currentColor' }} />
//                 <YAxis tick={{ fill: 'currentColor' }} />
//                 <Tooltip
//                   formatter={(value, name) => {
//                     const label = products.find(p => p.value === name)?.label || 
//                                  categories.find(c => c.value === name)?.label || 
//                                  name;
//                     return [${value} units, label];
//                   }}
//                 />
//                 {allSelected.map((item, index) => (
//                   <Line
//                     key={item}
//                     type="monotone"
//                     dataKey={item}
//                     stroke={colors[index % colors.length]}
//                     strokeWidth={2}
//                     dot={{ r: 3 }}
//                     activeDot={{ r: 5 }}
//                   />
//                 ))}
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         ) : (
//           <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-md">
//             <p className="text-muted-foreground">Select products or categories to view demand trends</p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default DemandTrends;

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Sample product data
const products = [
  { value: 'desk-lamp', label: 'Desk Lamp' },
  { value: 'office-chair', label: 'Office Chair' },
  { value: 'monitor-stand', label: 'Monitor Stand' },
  { value: 'keyboard', label: 'Keyboard' },
  { value: 'mouse', label: 'Mouse' },
  { value: 'headphones', label: 'Headphones' },
];

// Sample categories
const categories = [
  { value: 'furniture', label: 'Furniture' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'office-supplies', label: 'Office Supplies' },
  { value: 'kitchen', label: 'Kitchen' },
];

// Sample data for different time ranges
const generateData = (days: number, selectedItems: string[]) => {
  const data = [];
  const now = new Date();
  const multipliers: Record<string, number> = {
    'desk-lamp': 1.2,
    'office-chair': 0.8,
    'monitor-stand': 0.5,
    'keyboard': 1.5,
    'mouse': 1.3,
    'headphones': 0.7,
    'furniture': 1.1,
    'electronics': 1.4,
    'office-supplies': 0.9,
    'kitchen': 0.6,
  };
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const entry: Record<string, any> = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    
    selectedItems.forEach(item => {
      const baseValue = 50 + Math.sin(i * 0.5) * 20;
      const multiplier = multipliers[item] || 1;
      entry[item] = Math.round(baseValue * multiplier);
    });
    
    data.push(entry);
  }
  
  return data;
};

const DemandTrends: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [openProducts, setOpenProducts] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  
  const handleProductSelect = (value: string) => {
    setSelectedProducts(current => 
      current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value]
    );
  };
  
  const handleCategorySelect = (value: string) => {
    setSelectedCategories(current => 
      current.includes(value) 
        ? current.filter(item => item !== value)
        : [...current, value]
    );
  };
  
  const allSelected = [...selectedProducts, ...selectedCategories];

  return (
    <Card className="col-span-2">
      {/* <CardHeader className="pb-2"> */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* <CardTitle>Product and Category Selection</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Select Products</label>
            <Popover open={openProducts} onOpenChange={setOpenProducts}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProducts}
                  className="w-full justify-between"
                >
                  {selectedProducts.length > 0
                    ? ${selectedProducts.length} product${selectedProducts.length > 1 ? 's' : ''} selected
                    : "Select products..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search products..." />
                  <CommandEmpty>No product found.</CommandEmpty>
                  <CommandGroup>
                    {products.map((product) => (
                      <CommandItem
                        key={product.value}
                        value={product.value}
                        onSelect={() => handleProductSelect(product.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedProducts.includes(product.value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {product.label}
                      </CommandItem>
                    ))} */}
                  {/* </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover> */}
          </div>
          
          {/* <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Select Categories</label>
            <Popover open={openCategories} onOpenChange={setOpenCategories}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCategories}
                  className="w-full justify-between"
                >
                  {selectedCategories.length > 0
                    ? ${selectedCategories.length} ${selectedCategories.length > 1 ? 'categories' : 'category'} selected
                    : "Select categories..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search categories..." />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup>
                    {categories.map((category) => (
                      <CommandItem
                        key={category.value}
                        value={category.value}
                        onSelect={() => handleCategorySelect(category.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategories.includes(category.value) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div> */}
        {/* </div>
      </CardContent> */}
    </Card>
  );
};

export default DemandTrends;