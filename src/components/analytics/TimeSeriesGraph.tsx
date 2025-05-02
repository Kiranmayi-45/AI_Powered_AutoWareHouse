import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Order {
  orderId: string;
  product: string;
  quantity: number;
  orderDate: string;   // ISO date string "YYYY-MM-DD"
  category: string;    // Product category (electronics, furniture)
  status: string;
}

const ordersData: Order[] = [
  { orderId: "ORD-001", product: "Office Chair", quantity: 5, orderDate: "2023-04-20", category: "Furniture", status: "Delivered" },
  { orderId: "ORD-002", product: "Desk Lamp", quantity: 10, orderDate: "2023-04-22", category: "Furniture", status: "In Transit" },
  { orderId: "ORD-003", product: "Printer Paper", quantity: 100, orderDate: "2023-04-24", category: "Electronics", status: "Shipped" },
  { orderId: "ORD-004", product: "Headphones", quantity: 3, orderDate: "2023-04-25", category: "Electronics", status: "Pending" },
  { orderId: "ORD-005", product: "Smartphone", quantity: 15, orderDate: "2023-04-26", category: "Electronics", status: "Shipped" },
  { orderId: "ORD-006", product: "Sofa", quantity: 2, orderDate: "2023-04-27", category: "Furniture", status: "Delivered" },
  { orderId: "ORD-007", product: "Smart TV", quantity: 7, orderDate: "2023-04-28", category: "Electronics", status: "Shipped" },
  { orderId: "ORD-008", product: "Dining Table", quantity: 4, orderDate: "2023-04-29", category: "Furniture", status: "Pending" }
];

const TimeSeriesGraph: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
//   const [textColor, setTextColor] = useState<string>("#000");

  useEffect(() => {
    
    const filteredOrders = ordersData.filter(
      (order) => order.category === "Electronics" || order.category === "Furniture"
    );

    const daily: Record<string, number> = {};
    filteredOrders.forEach(o => {
      daily[o.orderDate] = (daily[o.orderDate] || 0) + o.quantity;
    });

    // 3) Sort dates
    const dates = Object.keys(daily).sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    // 4) Build Chart.js data
    setChartData({
      labels: dates,
      datasets: [
        {
          label: "Total Quantity (Electronics & Furniture)",
          data: dates.map(d => daily[d]),
          fill: false,
          borderColor: "#4f46e5",
          backgroundColor: "#4f46e5",
          tension: 0.3,
          pointRadius: 4,
        },
      ],
    });
  }, []);

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Daily Order Quantities (Electronics & Furniture)",
      },
      legend: {
        position: "top",
        align: "end",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          parser: "yyyy-MM-dd",
          unit: "day",
          tooltipFormat: "PP",
          displayFormats: { day: "MMM d" },
        },
        title: {
          display: true,
          text: "Order Date",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Quantity",
        },
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div style={{ width: 800, margin: "2rem auto" }}>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <p>Loading chart…</p>
      )}
    </div>
  );
};

export default TimeSeriesGraph;