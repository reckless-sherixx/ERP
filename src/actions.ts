"use server";
import { requireUser } from "@/app/utils/hooks";
import {
  inventorySchema,
  invoiceSchema,
  orderSchema,
} from "@/app/utils/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { emailClient } from "./app/utils/mailtrap";
import { formatCurrency } from "./app/utils/formatCurrency";
import { InventoryStockStatus, ProductionStatus } from "@prisma/client";
import { createOrderNotification } from "./app/utils/notifcationService";

//Invoice Actions
export async function createInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.create({
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      userId: session.user?.id,
    },
  });

  const sender = {
    email: "plypicker@demomailtrap.com",
    name: "plypicker",
  };

  emailClient.send({
    from: sender,
    to: [{ email: "24155442@kiit.ac.in" }],
    template_uuid: "b638df95-3a0d-47a2-918a-7cde51e7d723",
    template_variables: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      invoiceDueDate: new Intl.DateTimeFormat("en-IN", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      invoiceAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),
      invoiceLink:
        process.env.NODE_ENV !== "production"
          ? `http://localhost:3000/api/v1/invoice/${data.id}`
          : `https://invoice-marshal.vercel.app/api/invoice/${data.id}`,
    },
  });

  return redirect("/api/v1/dashboard/invoices");
}

export async function editInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
    },
  });

  const sender = {
    email: "hello@demomailtrap.com",
    name: "Vidyansh",
  };

  emailClient.send({
    from: sender,
    to: [{ email: "24155442@kiit.ac.in" }],
    template_uuid: "4fe3a008-2b4f-4aef-a78f-9ea6e34b0102",
    template_variables: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      invoiceDueDate: new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      invoiceAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),
      invoiceLink:
        process.env.NODE_ENV !== "production"
          ? `http://localhost:3000/api/v1/invoice/${data.id}`
          : `https://invoice-marshal.vercel.app/api/invoice/${data.id}`,
    },
  });

  return redirect("/api/v1/dashboard/invoices");
}

export async function DeleteInvoice(invoiceId: string) {
  const session = await requireUser();

  await prisma.invoice.delete({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
  });

  return redirect("/api/v1/dashboard/invoices");
}

export async function MarkAsPaidAction(invoiceId: string) {
  const session = await requireUser();

  await prisma.invoice.update({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
    data: {
      status: "PAID",
    },
  });

  return redirect("/api/v1/dashboard/invoices");
}

//OrderActions
export async function createOrder(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: orderSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const timestamp = Date.now();
  const orderNumber = `ORD-${new Date().getFullYear()}-${timestamp.toString().slice(-4)}`;

  const newOrder = await prisma.order.create({
    data: {
      orderNumber,
      customerAddress: submission.value.customerAddress,
      customerEmail: submission.value.customerEmail,
      customerName: submission.value.customerName,
      customerPhone: submission.value.customerPhone,
      estimatedDelivery: submission.value.estimatedDelivery,
      itemDescription: submission.value.itemDescription,
      itemQuantity: submission.value.itemQuantity,
      itemRate: submission.value.itemRate,
      status: submission.value.status,
      productId: submission.value.productId,
      totalPrice: submission.value.totalPrice,
      attachment: submission.value.attachment,
      note: submission.value.note,
      userId: session.user?.id,
    },
    select: {
      orderNumber: true,
      customerName: true,
      totalPrice: true,
      user: {
        select: {
          name: true,
          role: true,
        },
      },
    },
  });
 try {
    const notificationData = {
      type: 'orderNotification',
      data: {
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        totalPrice: newOrder.totalPrice,
        createdBy: newOrder.user?.name || "Unknown"
      }
    };

    // Only use createOrderNotification which handles both database storage and socket emission
    const notificationSent = await createOrderNotification(notificationData);
    
    if (!notificationSent) {
      console.error("Failed to send notification");
    } else {
      console.log("Notification sent successfully");
    }

  } catch (error) {
    console.error("Error sending notification:", error);
  }

  return redirect("/api/v1/dashboard/orders");
}

export async function editOrder(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: orderSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.order.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      customerAddress: submission.value.customerAddress,
      customerEmail: submission.value.customerEmail,
      customerName: submission.value.customerName,
      customerPhone: submission.value.customerPhone,
      estimatedDelivery: submission.value.estimatedDelivery,
      itemDescription: submission.value.itemDescription,
      itemQuantity: submission.value.itemQuantity,
      itemRate: submission.value.itemRate,
      status: submission.value.status,
      productId: submission.value.productId,
      totalPrice: submission.value.totalPrice,
      note: submission.value.note,
      userId: session.user?.id,
    },
  });
  return redirect("/api/v1/dashboard/orders");
}

export async function DeleteOrder(orderId: string) {
  const session = await requireUser();

  await prisma.order.delete({
    where: {
      userId: session.user?.id,
      id: orderId,
    },
  });

  return redirect("/api/v1/dashboard/orders");
}

//Inventory actions
export async function addMaterial(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: inventorySchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const timeStamp = Date.now();
  const materialId = `MAT-${timeStamp.toString().slice(-4)}`;

  //Determine stock status based on current stock and reorder stock
  const currentStock = submission.value.currentStock;
  const reorderPoint = submission.value.reorderPoint;
  let stockStatus;

  if (currentStock === 0) {
    stockStatus = InventoryStockStatus.OUT_OF_STOCK;
  } else if (currentStock <= reorderPoint) {
    stockStatus = InventoryStockStatus.LOW_STOCK;
  } else {
    stockStatus = InventoryStockStatus.IN_STOCK;
  }

  await prisma.inventoryItem.create({
    data: {
      materialId,
      materialName: submission.value.materialName,
      currentStock: submission.value.currentStock,
      reorderPoint: submission.value.reorderPoint,
      unit: submission.value.unit,
      supplier: submission.value.supplier,
      stockStatus,
      category: submission.value.category,
      userId: session.user?.id,
    },
  });
  return redirect("/api/v1/factory/dashboard/inventory");
}

// Submit work actions
interface SubmitWorkParams {
  orderId: string;
  comment?: string
  fileUrl: string;
  isRevision?:boolean;
}

export async function submitDesignWork({ orderId, comment, fileUrl, isRevision }: SubmitWorkParams) {
    try {
        const session = await requireUser();

        const assignee = await prisma.assignee.findFirst({
            where: {
                orderId: orderId,
                userId: session.user.id,
            },
        });

        if (!assignee) {
            throw new Error("You are not assigned to this order");
        }

        // Find existing submission for this order
        const existingSubmission = await prisma.designSubmission.findFirst({
            where: {
                orderId,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const submission = await prisma.$transaction(async (tx) => {
            if (existingSubmission && isRevision) {
                return await tx.designSubmission.update({
                    where: {
                        id: existingSubmission.id
                    },
                    data: {
                        fileUrl,
                        comment,
                        isApprovedByAdmin: false,
                        isApprovedByCustomer: false,
                    },
                });
            } else {
                return await tx.designSubmission.create({
                    data: {
                        fileUrl,
                        comment,
                        orderId,
                        isApprovedByAdmin: false,
                        isApprovedByCustomer: false,
                    },
                });
            }
        });

        // Update order and assignee status
        await prisma.$transaction([
            prisma.order.update({
                where: { id: orderId },
                data: {
                    status: "IN_PRODUCTION",
                },
            }),
            prisma.assignee.update({
                where: { id: assignee.id },
                data: {
                    status: "PENDING",
                },
            }),
        ]);

        return submission;
    } catch (error) {
        console.error('Error submitting design work:', error);
        throw new Error('Failed to submit design work');
    }
}


export async function submitOrderWork({ orderId, fileUrl }: SubmitWorkParams) {
    try {
        const session = await requireUser();

        const taskAssignment = await prisma.taskAssignment.findFirst({
            where: {
                orderId: orderId,
                userId: session.user.id,
            },
            include: {
                OrderSubmission: true
            }
        });

        if (!taskAssignment) {
            throw new Error("You are not assigned to this order");
        }

        const submissionCount = taskAssignment.OrderSubmission?.length || 0;

        // Check if max submissions reached
        if (submissionCount >= 3) {
            throw new Error("Maximum submissions reached");
        }

        const result = await prisma.$transaction([
            prisma.orderSubmission.create({
                data: {
                    fileUrl,
                    orderId,
                    taskAssignmentId: taskAssignment.id
                }
            }),

            // Update task assignment status
            prisma.taskAssignment.update({
                where: { id: taskAssignment.id },
                data: {
                    status: getNextStatus(submissionCount)
                }
            }),

            // Update order status
            prisma.order.update({
                where: { id: orderId },
                data: {
                    productionStatus: getNextStatus(submissionCount),
                    ...(submissionCount === 2 && {
                        status: "COMPLETED"
                    })
                }
            })
        ]);

        return result[0]; 
    } catch (error) {
        console.error('Error submitting production work:', error);
        throw new Error('Failed to submit production work');
    }
}

// Helper function to determine next status
function getNextStatus(submissionCount: number): ProductionStatus {
    switch (submissionCount) {
        case 0: // First submission 
            return "CUTTING";
        case 1: // Second submission
            return "ASSEMBLY";
        case 2: // Third submission
            return "FINISHING";
        default:
            return "PENDING";
    }
}
