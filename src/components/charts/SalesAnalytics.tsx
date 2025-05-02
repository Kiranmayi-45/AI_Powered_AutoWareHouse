import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Line } from 'react-chartjs-2';
import regression from 'regression';
import StockBarGraph from '../analytics/StockBarGraph';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SalesAnalytics: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [predictedSales, setPredictedSales] = useState<number | null>(null);

  useEffect(() => {
    const loadExcelData = async () => {
      const fileUrl = '/data/stocks-2.xlsx'; // Adjust your file path
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();

      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      // Group and prepare data
      const monthlySales: Record<string, number> = {};

      jsonData.forEach((row: any) => {
        if (row.Date && row.Order_Demand) {
          let date: Date;
          if (typeof row.Date === 'number') {
            // If somehow numeric date comes
            const excelEpoch = new Date(1899, 11, 30);
            date = new Date(excelEpoch.getTime() + row.Date * 24 * 60 * 60 * 1000);
          } else {
            // Parse string date like '27-07-2012'
            const [day, month, year] = row.Date.split('-');
            date = new Date(+year, +month - 1, +day);
          }
          const monthLabel = date.toLocaleString('default', { month: 'short', year: 'numeric' });
          monthlySales[monthLabel] = (monthlySales[monthLabel] || 0) + Number(row.Order_Demand);
        }
      });

      const labels = Object.keys(monthlySales);
      const quantities = Object.values(monthlySales);

      // Prepare data for linear regression
      const regressionData = labels.map((_, index) => [index, quantities[index]]);
      const result = regression.linear(regressionData);

      const predictedNextMonth = result.predict(regressionData.length)[1];

      setPredictedSales(predictedNextMonth);

      // Extend chart with predicted value
      const extendedLabels = [...labels, 'Next Month'];
      const extendedQuantities = [...quantities, predictedNextMonth];

      setChartData({
        labels: extendedLabels,
        datasets: [
          {
            label: 'Total Sales by Month',
            data: extendedQuantities,
            fill: false,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
          },
        ],
      });
    };

    loadExcelData();
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-semibold">📊 Sales Forecast</h2>
      <p>Predicted sales for next month: {predictedSales ? predictedSales.toFixed(2) : 'Loading...'}</p>
      {chartData && (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }}
        />
      )}
      <StockBarGraph />
    </div>
  );
};

export default SalesAnalytics;