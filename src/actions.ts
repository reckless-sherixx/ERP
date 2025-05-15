"use server"
import { requireUser } from "@/app/utils/hooks";
import { invoiceSchema } from "@/app/utils/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { emailClient } from "./app/utils/mailtrap";
import { formatCurrency } from "./app/utils/formatCurrency";

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
      // invoiceLink:
      //   process.env.NODE_ENV !== "production"
      //     ? `http://localhost:3000/api/invoice/${data.id}`
      //     : `https://invoice-marshal.vercel.app/api/invoice/${data.id}`,
    },
  });

  return redirect("/api/v1/dashboard/invoices");
}