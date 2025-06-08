"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";
import { FactoryOrder } from "@/types/factoryOrder";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: FactoryOrder;
}

export function OrderDetailsDialog({
  isOpen,
  onClose,
  order,
}: OrderDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            Complete information for order {order.orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Customer
              </h3>
              <p className="text-base font-medium">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">
                {order.customerEmail ?? ""}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Items Ordered
            </h3>
            <div className="bg-muted rounded-md p-3">
              <div className="space-y-2">
                {order.itemDescription.split(",").map((item, index) => (
                  <p key={index} className="text-sm">
                    {item.trim()}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {order.shippingAddress && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Shipping Address
              </h3>
              <p className="text-sm">{order.shippingAddress}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Status
              </h3>
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {order.status || "pending"}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Assigned To
              </h3>
              {order.TaskAssignment && order.TaskAssignment.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {order.TaskAssignment[0].user.name}
                  </p>
                </div>
              ) : (
                <p className="text-sm">Unassigned</p>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Design File
              </h3>
              {order.DesignSubmission && order.DesignSubmission.length > 0 ? (
                <Button asChild size="sm" variant="outline">
                  <Link href={order.DesignSubmission[0].fileUrl || ''} target="_blank">
                    <FileText className="mr-1 h-4 w-4" />
                    View Design
                  </Link>
                </Button>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  <FileText className="mr-1 h-4 w-4" />
                  No Design File
                </Button>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">
              Order Date
            </h3>
            <p className="text-sm">
              {new Date(order.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}