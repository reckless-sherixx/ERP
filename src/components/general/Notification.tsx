"use client";

import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

interface OrderNotification {
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  createdBy: string;
  timestamp?: Date;
}

export function NotificationComponent() {
  const { socket, isConnected } = useSocket();
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);

  // Fetch existing notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;
      
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        if (data.notifications) {
          setNotifications(data.notifications.map((n: any) => ({
            ...n.content,
            timestamp: new Date(n.createdAt)
          })));
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [session?.user?.id]);

  // Handle real-time notifications
  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    console.log("Setting up socket connection...");
    socket.emit("authenticate", session.user.id);

    const handleNotification = (notification: OrderNotification) => {
      console.log('Received notification:', notification);
      
      const notificationWithTimestamp = {
        ...notification,
        timestamp: new Date()
      };
      
      toast.message("New Order Created!", {
        description: (
          <div className="flex flex-col gap-1">
            <p>Order #{notification.orderNumber}</p>
            <p>Customer: {notification.customerName}</p>
            <p>Amount: {formatCurrency({ amount: notification.totalPrice, currency: "INR" })}</p>
            <p>Created by: {notification.createdBy}</p>
          </div>
        ),
      });
      
      setNotifications(prev => [notificationWithTimestamp, ...prev]);
    };

    socket.on('orderNotification', handleNotification);

    return () => {
      socket.off('orderNotification', handleNotification);
    };
  }, [socket, session?.user?.id]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white">
              {notifications.length}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-2 border-b">
          <p className="font-medium">Notifications</p>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotifications([])}
              className="h-8 text-xs"
            >
              <Trash className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="p-2 grid gap-2">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="p-2 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium">Order #{notification.orderNumber}</p>
                    {notification.timestamp && (
                      <span className="text-xs text-muted-foreground">
                        {format(notification.timestamp, 'MMM dd, HH:mm')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">Customer: {notification.customerName}</p>
                  <p className="text-sm">
                    Amount: {formatCurrency({ amount: notification.totalPrice, currency: "INR" })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created by: {notification.createdBy}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}