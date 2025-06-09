"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductionSubmission } from "@/types/ProductionSubmission";
import { ProductionStatus } from "@prisma/client";
import { SubmitProductionDialog } from "./SubmitProductionDialog";
import { ProductionOrderDialog } from "./ProductionOrderDialog";

interface ProductionTaskListProps {
  initialData: ProductionSubmission[];
  isAdmin: boolean;
  userId: string;
}

export function ProductionTaskList({
  initialData,
  isAdmin,
  userId,
}: ProductionTaskListProps) {
  const [viewingOrder, setViewingOrder] = useState<ProductionSubmission | null>(
    null
  );
  const [submittingOrder, setSubmittingOrder] =
    useState<ProductionSubmission | null>(null);

  const getStatusBadgeVariant = (status: ProductionStatus) => {
    switch (status) {
      case "CUTTING":
        return "default";
      case "ASSEMBLY":
        return "secondary";
      case "FINISHING":
        return "warning";
      default:
        return "outline";
    }
  };

  return (
    <>
      <Card className="border border-black/20 shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialData.map((order) => (
              <div key={order.id} className="border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium">{order.orderNumber}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={getStatusBadgeVariant(order.productionStatus)}
                      >
                        {order.productionStatus.toLowerCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">{order.customerName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {order.itemDescription}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingOrder(order)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {!isAdmin && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setSubmittingOrder(order)}
                    >
                      Submit Work
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

       {submittingOrder && (
                <SubmitProductionDialog
                    isOpen={!!submittingOrder}
                    onClose={() => setSubmittingOrder(null)}
                    orderNumber={submittingOrder.orderNumber}
                    orderId={submittingOrder.id}
                    currentStage={submittingOrder.productionStatus}
                />
            )}

            {viewingOrder && (
                <ProductionOrderDialog
                    isOpen={!!viewingOrder}
                    onClose={() => setViewingOrder(null)}
                    order={viewingOrder}
                    isAdmin={isAdmin}
                    userId={userId}
                />
            )}
        </>
    );
}