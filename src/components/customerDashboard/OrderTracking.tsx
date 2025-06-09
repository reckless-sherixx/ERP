"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import { Eye, Loader2 } from "lucide-react";
import Link from "next/link";

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  customerEmail: string;
  itemDescription: string;
  totalPrice: number;
  createdAt: Date;
  DesignSubmission:
    | {
        id: string;
        fileUrl: string;
        comment: string;
        isApprovedByCustomer: boolean;
        isApprovedByAdmin: boolean;
        createdAt: Date;
      }[]
    | null;
  Assignee: {
    status: string;
  }[];
  productionStatus: string;
  TaskAssignment: {
    OrderSubmission: {
      id: string;
      fileUrl: string;
      createdAt: Date;
    }[];
  }[];
}

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `/api/v1/customerDashboard/trackOrder/track-order?orderNumber=${encodeURIComponent(
          orderNumber
        )}&email=${encodeURIComponent(email)}`
      );
      if (!response.ok) throw new Error("Order not found");

      const data = await response.json();
      setOrderDetails(data);
    } catch {
      toast.error("Could not find order with provided details");
    } finally {
      setLoading(false);
    }
  };

  const handleDesignAction = async (
    action: "approve" | "revision",
    submissionId: string
  ) => {
    setActionInProgress(true);
    try {
      const response = await fetch(
        `/api/v1/customerDashboard/trackOrder/design-action`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submissionId,
            action,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to process action");

      toast.success(
        action === "approve"
          ? "Design approved successfully"
          : "Revision requested successfully"
      );
      // Refresh order details
      await handleTrackOrder(new Event("submit") as any);
    } catch {
      toast.error("Failed to process your request");
      setActionInProgress(false); // Reset only on error
    }
  };
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Track Your Order</h1>
          <p className="text-muted-foreground mt-2">
            Enter your order number and email to check the status of your order
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter Your Order Details</CardTitle>
            <CardDescription>
              Please provide your order number and the email address used for
              the order.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="orderNumber">Order Number</label>
                <Input
                  id="orderNumber"
                  placeholder="e.g. ORD-2024-1234"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Tracking Order...
                  </>
                ) : (
                  "Track Order"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {orderDetails && (
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>
                Order #{orderDetails.orderNumber}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Current Status</h3>
                  <Badge variant="outline" className="mt-1">
                    {orderDetails.status.toLowerCase().replace("_", " ")}
                  </Badge>
                </div>
              </div>

              {orderDetails.DesignSubmission &&
                orderDetails.DesignSubmission.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Design Submissions</h3>
                    {orderDetails.DesignSubmission.filter(
                      (submission) => submission.isApprovedByAdmin
                    ) // Only show admin approved submissions
                      .map((submission) => (
                        <Card key={submission.id} className="p-4">
                          <div className="space-y-4">
                            <div className="aspect-video relative rounded-lg border overflow-hidden bg-muted">
                              {submission.fileUrl && (
                                <Image
                                  src={submission.fileUrl}
                                  alt="Design Preview"
                                  fill
                                  className="object-contain"
                                />
                              )}
                            </div>

                            {submission.comment && (
                              <div>
                                <h4 className="text-sm font-medium mb-1">
                                  Designer Notes:
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {submission.comment}
                                </p>
                              </div>
                            )}

                            <div className="flex justify-end gap-2">
                              {!submission.isApprovedByCustomer &&
                                !actionInProgress && (
                                  <>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        handleDesignAction(
                                          "revision",
                                          submission.id
                                        )
                                      }
                                      disabled={actionInProgress}
                                    >
                                      {actionInProgress ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Processing...
                                        </>
                                      ) : (
                                        "Request Revision"
                                      )}
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleDesignAction(
                                          "approve",
                                          submission.id
                                        )
                                      }
                                      disabled={actionInProgress}
                                    >
                                      {actionInProgress ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Processing...
                                        </>
                                      ) : (
                                        "Approve Design"
                                      )}
                                    </Button>
                                  </>
                                )}
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}

            {/* Production Progress */}
              {orderDetails.TaskAssignment?.[0]?.OrderSubmission &&
                orderDetails.TaskAssignment[0].OrderSubmission.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-medium">Production Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orderDetails.TaskAssignment[0].OrderSubmission.map(
                        (submission, index) => (
                          <Card key={submission.id} className="p-4">
                            <div className="space-y-4">
                              {/* Production Image Preview */}
                              <div className="aspect-video relative rounded-lg border overflow-hidden bg-muted">
                                {submission.fileUrl && (
                                  <Image
                                    src={submission.fileUrl}
                                    alt={`Production Stage ${index + 1}`}
                                    fill
                                    className="object-contain"
                                  />
                                )}
                              </div>

                              {/* Stage Information */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="text-sm font-medium">
                                    {index === 0
                                      ? "Cutting Stage"
                                      : index === 1
                                      ? "Assembly Stage"
                                      : "Finishing Stage"}
                                  </h4>
                                  <p className="text-xs text-muted-foreground">
                                    Submitted on{" "}
                                    {new Date(
                                      submission.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button asChild size="sm" variant="outline">
                                  <Link
                                    href={submission.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Full Image
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        )
                      )}
                    </div>

                    {/* Production Progress Badge */}
                    <div className="mt-4">
                      <Badge variant="outline">
                        Production Status:{" "}
                        {orderDetails.productionStatus.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
