"use server"
import { requireUser } from "@/app/utils/hooks";
import { invoiceSchema, orderSchema } from "@/app/utils/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { emailClient } from "./app/utils/mailtrap";
import { formatCurrency } from "./app/utils/formatCurrency";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";


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


//Order Actions
export async function createOrder(prevState: any, formData: FormData) {
  await requireUser();

  const submission = parseWithZod(formData, {
    schema: orderSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const orderCount = await prisma.order.count();
  const orderNumber = `ORD-${new Date().getFullYear()}-${(orderCount + 1)
    .toString()
    .padStart(4, "0")}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      status: "PENDING",
      estimatedDelivery: submission.value.estimatedDelivery,
      customer: {
        create: {
          name: submission.value.customerName,
          email: submission.value.customerEmail,
          phone: submission.value.customerPhone,
          address: {
            create: submission.value.address,            
          }
        }
      }
    }
  });

  revalidatePath("/api/v1/dashboard/orders");
  return redirect("/api/v1/dashboard/orders");
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await requireUser();

  await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status
    }
  });

  revalidatePath("/api/v1/dashboard/orders");
}

export async function deleteOrder(orderId: string) {
  await requireUser();

  await prisma.order.delete({
    where: {
      id: orderId,
    }
  });

  revalidatePath("/api/v1/dashboard/orders");
}