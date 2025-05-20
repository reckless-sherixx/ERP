import { prisma } from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { redirect } from "next/navigation";
import WarningGif from "../../../../../../../../../public/warning-gif.gif";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/components/general/SubmitButton";
import { DeleteOrder } from "@/actions";
import { canCreateOrder } from "@/app/utils/dashboardAccess";

async function Authorize(orderId: string, userId: string) {
    const data = await prisma.order.findUnique({
        where: {
            id: orderId,
            userId: userId,
        },
    });

    if (!data) {
        return redirect("/api/v1/dashboard/orders");
    }
}
type Params = Promise<{ orderId: string }>;

export default async function DeleteOrderRoute({
    params,
}: {
    params: Params;
}) {
    const session = await requireUser();
    if (!canCreateOrder(session.user.role)) {
        redirect("/api/v1/dashboard");
    }

    const { orderId } = await params;
    await Authorize(orderId, session.user?.id as string);
    return (
        <div className="flex flex-1 justify-center items-center">
            <Card className="max-w-[500px]">
                <CardHeader>
                    <CardTitle>Delete Order</CardTitle>
                    <CardDescription>
                        Are you sure that you want to delete this order?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Image src={WarningGif} alt="Warning Gif" className="rounded-lg" />
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <Link
                        className={buttonVariants({ variant: "outline" })}
                        href="/dashboard/orders"
                    >
                        Cancel
                    </Link>
                    <form
                        action={async () => {
                            "use server";
                            await DeleteOrder(orderId);
                        }}
                    >
                        <SubmitButton text="Delete Order" variant={"destructive"} />
                    </form>
                </CardFooter>
            </Card>
        </div>
    );
}