
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useInventory } from '@/contexts/InventoryContext';
import { useToast } from '@/hooks/use-toast';
import { Package, Truck, ShoppingCart, Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Sample data for orders
const sampleOrders = [
  {
    id: 'ORD-001',
    productName: 'Office Chair',
    quantity: 5,
    date: '2023-04-20',
    status: 'Delivered',
    trackingNo: 'TRK1234567',
    timeline: [
      { date: '2023-04-15', status: 'Ordered' },
      { date: '2023-04-16', status: 'Confirmed' },
      { date: '2023-04-18', status: 'Shipped' },
      { date: '2023-04-19', status: 'In Transit' },
      { date: '2023-04-20', status: 'Delivered' }
    ]
  },
  {
    id: 'ORD-002',
    productName: 'Desk Lamp',
    quantity: 10,
    date: '2023-04-22',
    status: 'In Transit',
    trackingNo: 'TRK7654321',
    timeline: [
      { date: '2023-04-20', status: 'Ordered' },
      { date: '2023-04-21', status: 'Confirmed' },
      { date: '2023-04-22', status: 'Shipped' },
      { date: '2023-04-24', status: 'In Transit' }
    ]
  },
  {
    id: 'ORD-003',
    productName: 'Printer Paper',
    quantity: 100,
    date: '2023-04-24',
    status: 'Shipped',
    trackingNo: 'TRK9876543',
    timeline: [
      { date: '2023-04-22', status: 'Ordered' },
      { date: '2023-04-23', status: 'Confirmed' },
      { date: '2023-04-24', status: 'Shipped' }
    ]
  },
  {
    id: 'ORD-004',
    productName: 'Headphones',
    quantity: 3,
    date: '2023-04-25',
    status: 'Pending',
    trackingNo: 'TRK1122334',
    timeline: [
      { date: '2023-04-25', status: 'Ordered' }
    ]
  }
];

// Map status to icons and progress
const statusConfig = {
  'Pending': { icon: Package, progress: 25, color: 'bg-yellow-500' },
  'Confirmed': { icon: Package, progress: 35, color: 'bg-blue-500' },
  'Shipped': { icon: Package, progress: 50, color: 'bg-blue-500' },
  'In Transit': { icon: Truck, progress: 75, color: 'bg-blue-500' },
  'Delivered': { icon: ShoppingCart, progress: 100, color: 'bg-green-500' }
};

const ReorderManager: React.FC = () => {
  const { getLowStockItems } = useInventory();
  const { toast } = useToast();
  const lowStockItems = getLowStockItems();
  const [orders, setOrders] = useState(sampleOrders);
  const [reorderQuantities, setReorderQuantities] = useState<Record<string, number>>({});
  const [selectedOrder, setSelectedOrder] = useState<typeof sampleOrders[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleQuantityChange = (itemId: string, value: string) => {
    const quantity = parseInt(value) || 0;
    setReorderQuantities({ ...reorderQuantities, [itemId]: quantity });
  };
  
  const handlePlaceOrder = (item: any) => {
    const quantity = reorderQuantities[item.id] || 0;
    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than zero.",
        variant: "destructive",
      });
      return;
    }
    
    const newOrder = {
      id: `ORD-00${orders.length + 1}`,
      productName: item.name,
      quantity,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      trackingNo: `TRK${Math.floor(Math.random() * 10000000)}`,
      timeline: [
        { date: new Date().toISOString().split('T')[0], status: 'Ordered' }
      ]
    };
    
    setOrders([...orders, newOrder]);
    
    // Reset reorder quantity
    const newReorderQuantities = { ...reorderQuantities };
    delete newReorderQuantities[item.id];
    setReorderQuantities(newReorderQuantities);
    
    toast({
      title: "Order Placed",
      description: `Order for ${quantity} ${item.name} has been placed successfully.`,
    });
  };
  
  const handleViewOrder = (order: typeof sampleOrders[0]) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };
  
  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Reorder Products</CardTitle>
          <CardDescription>
            Items below reorder threshold that need to be restocked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Qty</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Reorder Qty</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.threshold}</TableCell>
                    <TableCell className="w-36">
                      <Input
                        type="number"
                        min="1"
                        placeholder="Enter quantity"
                        value={reorderQuantities[item.id] || ''}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        onClick={() => handlePlaceOrder(item)}
                        disabled={!reorderQuantities[item.id] || reorderQuantities[item.id] <= 0}
                      >
                        Place Order
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    No low stock items to reorder.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Track your recent orders and their current status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const StatusIcon = statusConfig[order.status as keyof typeof statusConfig]?.icon || Package;
                
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <span>{order.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewOrder(order)}>
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="font-medium">{selectedOrder.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{selectedOrder.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-medium">{selectedOrder.trackingNo}</p>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Order Status</p>
                <div className="relative pt-4">
                  <Progress 
                    value={statusConfig[selectedOrder.status as keyof typeof statusConfig]?.progress || 0} 
                    className={statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color || ''} 
                  />
                  
                  <div className="flex justify-between mt-2">
                    {['Ordered', 'Confirmed', 'Shipped', 'In Transit', 'Delivered'].map((status, index) => {
                      const isCompleted = selectedOrder.timeline.some(t => t.status === status);
                      const isActive = selectedOrder.status === status;
                      
                      return (
                        <div key={status} className="text-center" style={{ width: '20%' }}>
                          <div 
                            className={`h-3 w-3 rounded-full mx-auto mb-1 ${
                              isActive ? 'bg-primary ring-2 ring-primary ring-opacity-50' : 
                              isCompleted ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                          <p className={`text-xs ${isCompleted || isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                            {status}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-medium mb-2">Order Timeline</p>
                <div className="space-y-3">
                  {selectedOrder.timeline.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                        <Timer className="h-3 w-3 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.status}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between pt-4 gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
                
                {selectedOrder.status !== 'Delivered' && (
                  <Button variant="destructive">Cancel Order</Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReorderManager;
