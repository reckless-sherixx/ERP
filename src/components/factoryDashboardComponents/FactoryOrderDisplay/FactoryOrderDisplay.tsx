"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, Package } from "lucide-react";
import { ProductionSubmission } from "@/types/ProductionSubmission";
import { useEffect, useState } from "react";
import { format } from "date-fns";

interface FactoryOrderDisplayProps {
  orders: ProductionSubmission[];
}

export function FactoryOrderDisplay({ orders }: FactoryOrderDisplayProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getOrdersByStatus = () => {
    const pending = orders.filter(order => order.productionStatus === "PENDING");
    const inProgress = orders.filter(order => 
      ["CUTTING", "ASSEMBLY"].includes(order.productionStatus)
    );
    const completed = orders.filter(order => order.productionStatus === "FINISHING");

    return {
      pending: pending.length,
      inProgress: inProgress.length,
      completed: completed.length
    };
  };

  const stats = getOrdersByStatus();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl md:text-2xl font-bold">FACTORY ORDER DISPLAY</h1>
          <div className="text-lg font-mono text-muted-foreground">
            {format(currentTime, "HH:mm:ss aa")}
            <span className="ml-4">
              {format(currentTime, "MM/dd/yyyy")}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4">
          <Badge variant="outline" className="whitespace-nowrap">Pending: {stats.pending}</Badge>
          <Badge variant="secondary" className="whitespace-nowrap">In Progress: {stats.inProgress}</Badge>
          <Badge variant="success" className="whitespace-nowrap">Completed: {stats.completed}</Badge>
        </div>
      </div>

      {/* Order Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-3 md:p-4 relative hover:shadow-lg transition-shadow">
            {/* Status Badge */}
            <Badge 
              className="absolute top-2 right-2 text-xs md:text-sm"
              variant={
                order.productionStatus === "PENDING" 
                  ? "outline"
                  : order.productionStatus === "FINISHING" 
                    ? "success" 
                    : "secondary"
              }
            >
              {order.productionStatus}
            </Badge>

            {/* Order Content */}
            <div className="mt-8 md:mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base md:text-lg font-bold">#{order.orderNumber}</span>
              </div>

              {/* Item Details */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 mt-1 shrink-0" />
                  <span className="text-sm line-clamp-2">{order.itemDescription}</span>
                </div>
                <div className="text-sm text-muted-foreground pl-6">
                  Qty: {order.TaskAssignment?.[0]?.OrderSubmission?.length || 0}
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-border pt-2">
                <p className="text-sm text-muted-foreground truncate">
                  Customer: <span className="font-medium">{order.customerName}</span>
                </p>
              </div>

              {/* Time Information */}
              <div className="border-t border-border pt-2 space-y-1.5">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="truncate">Created At: {new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}