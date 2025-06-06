import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";

export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ orderId: string }>;
    }
) {
    const { orderId } = await params;

    const data = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        select: {
            orderNumber: true,
            customerName: true,
            customerEmail: true,
            customerPhone: true,
            customerAddress: true,
            itemDescription: true,
            itemQuantity: true,
            itemRate: true,
            totalPrice: true,
            status: true,
            estimatedDelivery: true,
            note: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    email: true,
                }
            }
        },
    });

    if (!data) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // set font
    pdf.setFont("helvetica");

    //set header
    pdf.setFontSize(24);
    pdf.text("Order Details", 20, 20);

    // Created By Section
    pdf.setFontSize(12);
    pdf.text("Created By", 20, 40);
    pdf.setFontSize(10);
    pdf.text([data.user?.name ?? "", data.user?.email ?? ""], 20, 45);

    // Customer Section
    pdf.setFontSize(12);
    pdf.text("Customer Details", 20, 70);
    pdf.setFontSize(10);
    pdf.text([
        data.customerName,
        data.customerEmail ?? "",
        data.customerPhone,
        data.customerAddress
    ], 20, 75);

    // Order details
    pdf.setFontSize(10);
    pdf.text(`Order Number: #${data.orderNumber}`, 120, 40);
    pdf.text(
        `Created Date: ${new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
        }).format(data.createdAt)}`,
        120,
        45
    );
    pdf.text(
        `Est. Delivery: ${new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
        }).format(data.estimatedDelivery!)}`,
        120,
        50
    );
    pdf.text(`Status: ${data.status}`, 120, 55);

    // Item table header
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("Description", 20, 100);
    pdf.text("Quantity", 100, 100);
    pdf.text("Rate (INR)", 130, 100);
    pdf.text("Total (INR)", 160, 100);

    // draw header line
    pdf.line(20, 102, 190, 102);

    // Item Details
    pdf.setFont("helvetica", "normal");
    pdf.text(data.itemDescription, 20, 110);
    pdf.text(data.itemQuantity.toString(), 100, 110);
    pdf.text(
        Number(data.itemRate).toLocaleString(),
        130,
        110
    );
    pdf.text(
        Number(data.totalPrice).toLocaleString(),
        160,
        110
    );

    // Total Section
    pdf.line(20, 115, 190, 115);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total (INR)", 130, 130);
    pdf.text(
        Number(data.totalPrice).toLocaleString(),
        160,
        130
    );

    //Additional Note
    if (data.note) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.text("Note:", 20, 150);
        pdf.text(data.note, 20, 155);
    }

    // generate pdf as buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "inline",
        },
    });
}