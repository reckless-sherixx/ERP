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
import { ProductionSubmission } from "@/types/ProductionSubmission";

import Link from "next/link";
import { ProductionStatus } from "@prisma/client";

interface ProductionOrderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: ProductionSubmission;
  isAdmin: boolean;
  userId: string;
}

export function ProductionOrderDialog({
  isOpen,
  onClose,
  order,
  isAdmin,
  userId,
}: ProductionOrderDialogProps) {
  const getProgressPercentage = (status: ProductionStatus) => {
    switch (status) {
      case "PENDING":
        return "0";
      case "CUTTING":
        return "33";
      case "ASSEMBLY":
        return "66";
      case "FINISHING":
        return "100";
      default:
        return "0";
    }
  };

  // Get the current task assignment and user safely
  const currentTask = order.TaskAssignment?.[0];
  const assignedUser = currentTask?.User;
  const latestSubmission = currentTask?.OrderSubmission?.[0];

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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Status
              </h3>
              <Badge variant="secondary" className="gap-1">
                <Clock className="h-3 w-3" />
                {order.productionStatus.toLowerCase()}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                {isAdmin ? "Assigned To" : "Design Files"}
              </h3>
              {isAdmin ? (
                currentTask ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {assignedUser?.name ?? "No name provided"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm">Unassigned</p>
                )
              ) : (
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={order.DesignSubmission?.[0]?.fileUrl ?? "#"}
                    target="_blank"
                    className={
                      !order.DesignSubmission?.[0]?.fileUrl
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  >
                    <FileText className="mr-1 h-4 w-4" />
                    View Design Files
                  </Link>
                </Button>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Progress
              </h3>
              <div className="relative pt-2">
                <div className="overflow-hidden h-2 text-xs flex bg-secondary rounded-full">
                  <div
                    style={{
                      width: `${getProgressPercentage(
                        order.productionStatus
                      )}%`,
                    }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-300"
                  />
                </div>
                <div className="flex mb-2 items-center justify-end">
                  <div>
                    <span className="text-sm font-semibold inline-block text-primary">
                      {getProgressPercentage(order.productionStatus)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                {isAdmin ? "Latest Submission" : "Your Submissions"}
              </h3>
              {isAdmin ? (
                latestSubmission ? (
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={latestSubmission.fileUrl ?? "#"}
                      target="_blank"
                      className={
                        !latestSubmission.fileUrl
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    >
                      <FileText className="mr-1 h-4 w-4" />
                      View Work
                    </Link>
                  </Button>
                ) : (
                  <p className="text-sm">No submissions yet</p>
                )
              ) : latestSubmission ? (
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={latestSubmission.fileUrl ?? "#"}
                    target="_blank"
                    className={
                      !latestSubmission.fileUrl
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  >
                    <FileText className="mr-1 h-4 w-4" />
                    View Your Latest Work
                  </Link>
                </Button>
              ) : (
                <p className="text-sm">You haven&apos;t submitted any work yet</p>
              )}
            </div>
          </div>

          {/* Submission History */}
          {isAdmin && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                Submission History
              </h3>
              <div className="space-y-2">
                {currentTask?.OrderSubmission?.map(
                  (submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          Submitted on{" "}
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button asChild size="sm" variant="outline">
                        <Link
                          href={submission.fileUrl ?? "#"}
                          target="_blank"
                          className={
                            !submission.fileUrl
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        >
                          <FileText className="mr-1 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

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
