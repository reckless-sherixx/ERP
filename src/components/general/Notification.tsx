"use client";

import { useSocket } from "@/context/SocketContext";
import { Button } from "../ui/button";
import { BellRing } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/app/utils/formatCurrency";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
interface DisplayNotification {
  id: string;
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  createdBy: string;
  timestamp: Date;
}

interface RoomInfo {
  connectedUsers: number;
  room: string;
}

export function NotificationComponent() {
  const { socket, isConnected, reconnect } = useSocket();
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<DisplayNotification[]>([]);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({ connectedUsers: 0, room: '' });
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

   const isAdminRef = useRef(false);
  

  const handleNotificationClick = (orderNumber: string) => {
    router.push(`/api/v1/dashboard/taskAssignment`);
    handleMarkAsRead();
  };
  useEffect(() => {
    isAdminRef.current = session?.user?.role === Role.SYSTEM_ADMIN || 
                        session?.user?.role === Role.ADMIN;
  }, [session?.user?.role]);

  // First useEffect for loading saved notifications
  useEffect(() => {
    if (!isAdminRef.current) {
      return;
    }

    try {
      const savedNotifications = localStorage.getItem('adminNotifications');
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.error('Error loading saved notifications:', error);
    }
  }, []);

  // Second useEffect for socket connection
  useEffect(() => {
    if (!isConnected && isAdminRef.current) {
      console.log('Reconnecting socket for admin...');
      reconnect();
    }
  }, [isConnected, reconnect]);

  // Third useEffect for socket event handlers
  useEffect(() => {
    if (!socket || !isConnected || !isAdminRef.current) {
      return;
    }

    console.log('Setting up notification listeners for admin');

    const handleRoomUpdate = (data: any) => {
      console.log('Room update received:', data);
      setRoomInfo({
        connectedUsers: data.userCount,
        room: data.room
      });
    };

    const handleNotification = (payload: any) => {
      console.log('New notification received:', payload);
      if (!payload?.data) return;

      const newNotification: DisplayNotification = {
        id: crypto.randomUUID(),
        orderNumber: payload.data.orderNumber,
        customerName: payload.data.customerName,
        totalPrice: payload.data.totalPrice,
        createdBy: payload.data.createdBy,
        timestamp: new Date()
      };

      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        try {
          localStorage.setItem('adminNotifications', JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save notifications:', error);
        }
        return updated;
      });

      setUnreadCount(prev => prev + 1);

      toast.message("New Order Created!", {
        description: (
          <div className="flex flex-col gap-1">
            <p>Order #{newNotification.orderNumber}</p>
            <p>Customer: {newNotification.customerName}</p>
            <p>Amount: {formatCurrency({ amount: newNotification.totalPrice, currency: "INR" })}</p>
            <p>Created by: {newNotification.createdBy}</p>
          </div>
        ),
      });
    };

    socket.on('room-updated', handleRoomUpdate);
    socket.on('orderNotification', handleNotification);

    return () => {
      console.log('Cleaning up notification listeners for admin');
      socket.off('room-updated', handleRoomUpdate);
      socket.off('orderNotification', handleNotification);
    };
  }, [socket, isConnected]);
  const handleMarkAsRead = () => {
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('adminNotifications');
  };

  if (status === 'loading') {
    return null;
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <BellRing className="size-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px]">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span>Notifications</span>
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotifications}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="p-4 cursor-pointer hover:bg-muted"
                  onClick={() => handleNotificationClick(notification.orderNumber)}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Order #{notification.orderNumber}
                      </span>
                      <span className="text-xs text-muted-foreground pl-10">
                        {format(new Date(notification.timestamp), 'MMM dd, HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer: {notification.customerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Amount: {formatCurrency({ amount: notification.totalPrice, currency: "INR" })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created by: {notification.createdBy}
                    </p>

                  </div>
                </DropdownMenuItem>
              ))
            )}
          </ScrollArea>
          {notifications.length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAsRead}
                  className="w-full text-xs"
                >
                  Mark all as read
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}