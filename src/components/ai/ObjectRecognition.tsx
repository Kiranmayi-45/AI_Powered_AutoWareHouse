import React, { useState } from 'react';
import * as tmImage from '@teachablemachine/image';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Camera, Upload, RefreshCw, Check, Package, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/contexts/InventoryContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/kGRn3M7mj/';

const ObjectRecognition: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ label: string; confidence: number }[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [mode, setMode] = useState<'checkin' | 'checkout'>('checkin');
  const { toast } = useToast();
  const { inventory, addItem, updateItem } = useInventory();
  const navigate = useNavigate();

  let model: tmImage.CustomMobileNet | null = null;
  let modelLoaded = false;

  const loadModel = async () => {
    if (!modelLoaded) {
      model = await tmImage.load(MODEL_URL + 'model.json', MODEL_URL + 'metadata.json');
      modelLoaded = true;
    }
  };

  const analyzeImage = async (imageElement: HTMLImageElement) => {
    setIsAnalyzing(true);
    await loadModel();

    if (model && imageElement) {
      const predictions = await model.predict(imageElement, false);
      const filteredResults = predictions
        .filter(p => p.probability > 0.6)
        .map(p => ({ label: p.className, confidence: p.probability }));

      setResults(filteredResults);
      setIsAnalyzing(false);

      for (const item of filteredResults) {
        const existing = inventory.find(
          (inv) => inv.name.toLowerCase() === item.label.toLowerCase()
        );
      
        if (existing) {
          if (mode === 'checkin') {
            await updateItem(existing.id, {
              quantity: existing.quantity + 1,
              lastRestocked: new Date()
            });
        
            toast({
              title: `Checked In: ${item.label}`,
              description: `Quantity increased by 1.`,
              variant: 'default'
            });
          } else {
            // Check if there's at least 1 item before decrementing
            if (existing.quantity > 0) {
              await updateItem(existing.id, {
                quantity: existing.quantity - 1,
                // Use lastActivity or another existing property instead
                lastRestocked: new Date() // Using the existing lastRestocked field
              });
              
              toast({
                title: `Checked Out: ${item.label}`,
                description: `Quantity decreased by 1.`,
                variant: 'default'
              });
            } else {
              toast({
                title: `Cannot Check Out: ${item.label}`,
                description: `Quantity is already at 0.`,
                variant: 'destructive'
              });
            }
          }
        } else {
          toast({
            title: `Item Not Found`,
            description: `"${item.label}" does not exist in inventory.`,
            variant: 'destructive'
          });
        }
      }
      
      toast({
        title: mode === 'checkin' ? 'Inventory Updated!' : 'Items Checked Out!',
        description: mode === 'checkin' ? 'Quantities incremented.' : 'Quantities decremented.',
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        setTimeout(() => {
          const image = document.getElementById('scanned-image') as HTMLImageElement;
          if (image) analyzeImage(image);
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };

  const activateCamera = () => {
    setCameraActive(true);
    setTimeout(() => {
      setImageUrl('/placeholder.svg');
      setTimeout(() => {
        const image = document.getElementById('scanned-image') as HTMLImageElement;
        if (image) analyzeImage(image);
      }, 100);
    }, 1500);
  };

  const resetDemo = () => {
    setImageUrl(null);
    setResults([]);
    setCameraActive(false);
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>AI Object Recognition</CardTitle>
          <CardDescription>
            Scan warehouse items using a trained AI model
          </CardDescription>
          <Tabs 
            defaultValue="checkin" 
            value={mode} 
            onValueChange={(value) => setMode(value as 'checkin' | 'checkout')}
            className="w-full mt-4"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="checkin" className="flex items-center">
                <ArrowUp className="mr-2 h-4 w-4" />
                Check In Items
              </TabsTrigger>
              <TabsTrigger value="checkout" className="flex items-center">
                <ArrowDown className="mr-2 h-4 w-4" />
                Check Out Items
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg aspect-video bg-muted flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img
                    id="scanned-image"
                    src={imageUrl}
                    alt="Uploaded for scanning"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6">
                    <Package className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {cameraActive
                        ? 'Activating camera...'
                        : mode === 'checkin' 
                          ? 'Upload an image or use camera to check in items'
                          : 'Upload an image or use camera to check out items'
                      }
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isAnalyzing || cameraActive}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={activateCamera}
                  disabled={isAnalyzing || cameraActive}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Use Camera
                </Button>
              </div>

              {(imageUrl || cameraActive) && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={resetDemo}
                  disabled={isAnalyzing}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Demo
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4 h-full">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-medium">Detection Results</h3>
                  {mode === 'checkin' ? (
                    <div className="ml-auto px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Check In Mode
                    </div>
                  ) : (
                    <div className="ml-auto px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                      Check Out Mode
                    </div>
                  )}
                </div>

                {isAnalyzing ? (
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-sm">AI analyzing image...</p>
                    <div className="space-y-1">
                      <Progress value={45} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Processing</span>
                        <span>45%</span>
                      </div>
                    </div>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted">
                        <div className="flex items-center">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          <span>{result.label}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
                          <span className="text-muted-foreground ml-1">confidence</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48">
                    <p className="text-center text-muted-foreground">
                      {imageUrl
                        ? 'No items detected. Try a different image.'
                        : mode === 'checkin'
                          ? 'Upload an image or use camera to start check-in detection'
                          : 'Upload an image or use camera to start check-out detection'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ObjectRecognition;