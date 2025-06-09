"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductionSubmission } from "@/types/ProductionSubmission";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Users, Clock, Scissors, Wrench, CheckCircle, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProductionOverviewProps {
  data: ProductionSubmission[];
  inventoryData: {
      id: string;
      stockStatus: InventoryStockStatus;
  }[];
  userId: string;
}

export function ProductionOverview({ data, inventoryData, userId }: ProductionOverviewProps) {
  // Sort orders by creation date to get most recent first
  const recentOrders = [...data]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Calculate statistics
  const stats = {
    total:data.length,
    pending: data.filter(order => order.productionStatus === "PENDING").length,
    cutting: data.filter(order => order.productionStatus === "CUTTING").length,
    assembly: data.filter(order => order.productionStatus === "ASSEMBLY").length,
    finished: data.filter(order => order.productionStatus === "FINISHING").length,
  };

  // Chart configuration
  const chartData = {
    labels: ['All Tasks', 'Pending', 'Cutting', 'Assembly', 'Finished'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [stats.total, stats.pending, stats.cutting, stats.assembly, stats.finished],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Production Tasks Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Update inventory stats to use inventoryData
  const inventoryStats = {
    inStock: inventoryData.filter(item => item.stockStatus === "IN_STOCK").length,
    lowStock: inventoryData.filter(item => item.stockStatus === "LOW_STOCK").length,
    outOfStock: inventoryData.filter(item => item.stockStatus === "OUT_OF_STOCK").length,
  };

  return (
    <div className="space-y-6">
      {/* Production Stats Grid */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned Tasks</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cutting</CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cutting}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assembly</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assembly}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finished</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.finished}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.inStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.lowStock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* Existing chart */}
      <Card>
        <CardContent className="pt-6">
          <Bar data={chartData} options={chartOptions} height={100} />
        </CardContent>
      </Card>
    </div>
  );
}