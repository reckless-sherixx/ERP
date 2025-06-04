import { Metadata } from "next";
import OrderTracking from "@/components/customerDashboard/OrderTracking";

export const metadata: Metadata = {
    title: "Track Order | ERP System",
    description: "Track your order status and view design submissions",
};

export default function TrackOrderPage() {
    return (
        <div className="container mx-auto py-10">
            <div className="max-w-2xl mx-auto">
                <OrderTracking />
            </div>
        </div>
    );
}