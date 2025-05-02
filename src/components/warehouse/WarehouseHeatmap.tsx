import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type ShelfData = {
  id: string;
  pickRate: number;
  items: number;
  capacity: number;
  products: ShelfProduct[];
};

type ShelfProduct = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  pickHistory: Array<{ date: string; picks: number }>;
};

// Sample data generation
const generateHeatmapData = (): ShelfData[] => {
  const zones = ['A', 'B', 'C', 'D'];
  const shelves: ShelfData[] = [];

  for (const zone of zones) {
    for (let i = 1; i <= 4; i++) {
      const id = `${zone}-${i}`;
      const pickRate = Math.floor(Math.random() * 100);
      const capacity = Math.floor(Math.random() * 100) + 50;
      const items = Math.floor(Math.random() * capacity);

      const products: ShelfProduct[] = [];
      const categories = ['Electronics', 'Office Supplies', 'Furniture', 'Kitchen'];
      const productNames = [
        'Desk Lamp', 'Office Chair', 'Keyboard', 'Monitor', 'Coffee Maker',
        'File Cabinet', 'Headphones', 'Notebook Set', 'Desk Organizer', 'Whiteboard'
      ];

      const numProducts = Math.floor(Math.random() * 3) + 2;
      for (let j = 0; j < numProducts; j++) {
        const productId = `P-${zone}${i}-${j}`;
        const name = productNames[Math.floor(Math.random() * productNames.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const quantity = Math.floor(Math.random() * 30) + 5;

        const pickHistory: { date: string; picks: number }[] = [];
        const now = new Date();
        for (let k = 6; k >= 0; k--) {
          const date = new Date(now);
          date.setDate(now.getDate() - k);
          pickHistory.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            picks: Math.floor(Math.random() * 10)
          });
        }

        products.push({ id: productId, name, category, quantity, pickHistory });
      }

      shelves.push({ id, pickRate, items, capacity, products });
    }
  }

  return shelves;
};

const shelfData = generateHeatmapData();

const getColorByPickRate = (pickRate: number): string => {
  if (pickRate >= 80) return 'hsl(350, 80%, 60%)';
  if (pickRate >= 60) return 'hsl(20, 80%, 60%)';
  if (pickRate >= 40) return 'hsl(50, 80%, 60%)';
  if (pickRate >= 20) return 'hsl(100, 60%, 60%)';
  return 'hsl(180, 80%, 75%)';
};

const WarehouseHeatmap: React.FC = () => {
  const [selectedShelf, setSelectedShelf] = useState<ShelfData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  // `null` means no sort; only sort when user clicks a button
  const [sortOption, setSortOption] = useState<'pickRate' | 'items' | null>(null);

  const handleShelfClick = (shelf: ShelfData) => {
    setSelectedShelf(shelf);
    setSheetOpen(true);
  };

  // Compute displayShelves: original order if sortOption is null, otherwise sorted
  const displayShelves = useMemo(() => {
    if (!sortOption) return shelfData;
    const clone = [...shelfData];
    return clone.sort((a, b) =>
      sortOption === 'pickRate' ? b.pickRate - a.pickRate : b.items - a.items
    );
  }, [sortOption]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Warehouse Heatmap</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-muted-foreground">Pick Frequency</div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-[hsl(180,80%,75%)]"></div>
                <div className="w-4 h-4 rounded bg-[hsl(100,60%,60%)]"></div>
                <div className="w-4 h-4 rounded bg-[hsl(50,80%,60%)]"></div>
                <div className="w-4 h-4 rounded bg-[hsl(20,80%,60%)]"></div>
                <div className="w-4 h-4 rounded bg-[hsl(350,80%,60%)]"></div>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span>Low</span><span>→</span><span>High</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <Button onClick={() => setSortOption('pickRate')}>Sort by Pick Rate</Button>
            <Button onClick={() => setSortOption('items')}>Sort by Items</Button>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4">
            {displayShelves.map((shelf) => (
              <div
                key={shelf.id}
                className="aspect-square rounded-md border border-border p-2 cursor-pointer hover:shadow-md transition-shadow relative group"
                style={{ backgroundColor: getColorByPickRate(shelf.pickRate) }}
                onClick={() => handleShelfClick(shelf)}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 rounded-md transition-opacity">
                  <div className="text-white text-sm font-medium">View Details</div>
                </div>
                <div className="flex flex-col h-full">
                  <div className="text-xs font-medium mb-1 text-black/80">{shelf.id}</div>
                  <div className="mt-auto text-2xs text-black/70">{shelf.pickRate} picks/day</div>
                  <div className="text-2xs text-black/60">{shelf.items}/{shelf.capacity} items</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Shelf {selectedShelf?.id} Details</SheetTitle>
          </SheetHeader>
          {selectedShelf && (
            <div className="mt-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">Pick Rate</div>
                  <div className="text-2xl font-bold">{selectedShelf.pickRate} picks/day</div>
                </div>
                <div>
                  <div className="text-sm font-medium">Capacity</div>
                  <div className="text-2xl font-bold">
                    {selectedShelf.items}/{selectedShelf.capacity}
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="text-sm font-medium mb-3">Products</div>
                <div className="space-y-4">
                  {selectedShelf.products.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{product.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                          <div>
                            <div className="text-muted-foreground text-xs">Category</div>
                            <div>{product.category}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Quantity</div>
                            <div>{product.quantity}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-xs">Shelf ID</div>
                            <div>{selectedShelf.id}</div>
                          </div>
                        </div>

                        <div className="h-32">
                          <p className="text-xs text-muted-foreground mb-1">Pick History (7 days)</p>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={product.pickHistory}
                              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                              <YAxis tick={{ fontSize: 10 }} />
                              <Tooltip labelFormatter={label => `Date: ${label}`} />
                              <Bar dataKey="picks" fill={getColorByPickRate(selectedShelf.pickRate)}>
                                {product.pickHistory.map((entry, idx) => (
                                  <Cell key={idx} fill={getColorByPickRate(entry.picks * 10)} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSheetOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default WarehouseHeatmap;