"use client";

import { useSocket } from "@/context/SocketContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { Button } from "../ui/button";

interface OrderNotification {
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  createdBy: string;
}

export function NotificationComponent() {
  const { socket, isConnected } = useSocket();
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for both newOrder and orderNotification events
    const handleNotification = (notification: OrderNotification) => {
      console.log('Notification received:', notification);
      toast.message("New Order Created!", {
        description: `Order ${notification.orderNumber} created by ${notification.createdBy}`,
      });
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on('newOrder', handleNotification);
    socket.on('orderNotification', handleNotification);

    socket.on('connect', () => {
      console.log('Connected to notification system');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    return () => {
      socket.off('newOrder', handleNotification);
      socket.off('orderNotification', handleNotification);
    };
  }, [socket]);

  return (
    <Button variant="ghost" className="relative">
      <Bell className="h-5 w-5" />
      {notifications.length > 0 && (
        <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600" />
      )}
    </Button>
  );
}