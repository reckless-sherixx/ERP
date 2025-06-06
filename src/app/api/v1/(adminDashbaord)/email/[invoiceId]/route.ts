import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ invoiceId: string }>;
    }
) {
    try {
        const session = await requireUser();

        const { invoiceId } = await params;

        const invoiceData = await prisma.invoice.findUnique({
            where: {
                id: invoiceId,
                userId: session.user?.id,
            },
        });

        if (!invoiceData) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        const sender = {
            email: "hello@demomailtrap.com",
            name: "plypicker",
        };

        emailClient.send({
            from: sender,
            to: [{ email: "24155442@kiit.ac.in" }],
            template_uuid: "2292a199-2403-4a8e-8998-ea53da1e0e42",
            template_variables: {
                first_name: invoiceData.clientName,
                company_info_name: "PlyPickerERP",
                company_info_address: "Chad street 124",
                company_info_city: "Munich",
                company_info_zip_code: "226166",
                company_info_country: "India",
            },
        });

        return NextResponse.json({ success: true });
    } catch{
        return NextResponse.json(
            { error: "Failed to send Email reminder" },
            { status: 500 }
        );
    }
}