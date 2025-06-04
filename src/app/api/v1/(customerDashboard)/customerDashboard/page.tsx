import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CustomerDashboardPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto text-center space-y-4">
                <h1 className="text-4xl font-bold">Customer Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome to your customer dashboard
                </p>
                <Button asChild>
                    <Link href="/api/v1/customerDashboard/trackOrder">
                        Track Your Order
                    </Link>
                </Button>
            </div>
        </div>
    );
}