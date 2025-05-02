import React, { useEffect, useState } from "react";
import TimeSeriesGraph from "../analytics/TimeSeriesGraph";
import * as XLSX from "xlsx";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Product {
  Product: string;
  Category: string;
}

const StockBarGraph: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const labelColor = "#6b7280"; // medium gray for labels

  // Load and parse Excel, then build chart data
  useEffect(() => {
    fetch("/data/stock_2.xlsx")
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: Product[] = XLSX.utils
          .sheet_to_json(ws, { header: ["Product", "Category"], defval: "" })
          .slice(1) as Product[];

        // Count items per category
        const counts: Record<string, number> = {};
        rows.forEach(({ Category }) => {
          const cat = Category.trim();
          if (!cat) return;
          counts[cat] = (counts[cat] || 0) + 1;
        });

        setChartData({
          labels: Object.keys(counts),
          datasets: [
            {
              label: "Product Count",
              data: Object.values(counts),
              backgroundColor: "#4f46e5", // purple bars
              borderColor: "#4f46e5",
            },
          ],
        });
      })
      .catch(console.error);
  }, []);

  // Chart.js options with gray labels
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Products by Category",
        color: labelColor,
      },
      legend: {
        position: "top",
        align: "end",
        labels: {
          color: labelColor,
        },
      },
      tooltip: {
        titleColor: labelColor,
        bodyColor: labelColor,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Category",
          color: labelColor,
        },
        ticks: {
          color: labelColor,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Count",
          color: labelColor,
        },
        ticks: {
          color: labelColor,
          precision: 0,
        },
      },
    },
  };

  return (
    <div style={{ width: 700, margin: "2rem auto" }}>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p style={{ textAlign: "center", color: labelColor }}>Loading chart…</p>
      )}
      
    </div>
  );
};

export default StockBarGraph;