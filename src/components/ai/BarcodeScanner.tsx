import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Barcode, Check } from 'lucide-react';

const BarcodeScanner: React.FC = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  const startScanner = () => {
    setScannedData(null);
    setIsScanning(true);

    const scanner = new Html5QrcodeScanner('scanner', {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    }, false); // Set verbose to false

    scanner.render(
      (decodedText) => {
        setScannedData(decodedText);
        scanner.clear().then(() => setIsScanning(false));
      },
      (error) => {
        // Optionally log scanning errors
        console.warn(error);
      }
    );
  };

  const resetScanner = () => {
    setScannedData(null);
    setIsScanning(false);
    const scannerDiv = document.getElementById('scanner');
    if (scannerDiv) scannerDiv.innerHTML = '';
  };

  const parsedData = scannedData
    ? (() => {
        const [packageId, productName] = scannedData.split(',');
        return { packageId: packageId?.trim(), productName: productName?.trim() };
      })()
    : null;

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle>Barcode Scanner</CardTitle>
          <CardDescription>
            Scan barcodes and retrieve product information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg aspect-video bg-muted flex items-center justify-center">
                {!scannedData && !isScanning && (
                  <div className="text-center p-6">
                    <Barcode className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Start scanner to read barcode</p>
                  </div>
                )}
                <div ref={scannerRef} id="scanner" className="w-full h-full" />
              </div>

              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={startScanner}
                  disabled={isScanning}
                >
                  <Barcode className="mr-2 h-4 w-4" />
                  Start Scanner
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={resetScanner}
                  disabled={!scannedData && !isScanning}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4 h-full">
                <div className="flex items-center mb-4">
                  <h3 className="text-lg font-medium">Scan Result</h3>
                </div>

                {scannedData ? (
                  <div className="space-y-2">
                    <div className="flex items-center p-3 rounded-md bg-muted justify-between">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>Package ID</span>
                      </div>
                      <span className="text-sm font-medium">{parsedData?.packageId}</span>
                    </div>
                    <div className="flex items-center p-3 rounded-md bg-muted justify-between">
                      <div className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span>Product Name</span>
                      </div>
                      <span className="text-sm font-medium">{parsedData?.productName}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48">
                    <p className="text-center text-muted-foreground">
                      {isScanning
                        ? 'Scanning in progress...'
                        : 'No data scanned yet. Start scanning to see results.'}
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

export default BarcodeScanner;