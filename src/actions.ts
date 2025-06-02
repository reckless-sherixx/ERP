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
import { InventoryStockStatus } from "@prisma/client";
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

  const materialCount = await prisma.inventoryItem.count();
  const materialId = `MAT-${(materialCount + 1).toString().padStart(4, "0")}`;

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
