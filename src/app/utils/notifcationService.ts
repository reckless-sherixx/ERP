import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { initSocketServer } from "@/lib/socket";

export interface OrderNotification {
  type: string;
  data: {
    orderNumber: string;
    customerName: string;
    totalPrice: number;
    createdBy: string;
  };
}

export async function createOrderNotification(notification: OrderNotification) {
  try {
    console.log("Creating notification:", notification);

    // Store notification in database
    const baseNotification = await prisma.notification.create({
      data: {
        templateId: "order_created",
        channels: "websocket",
        subject: "New Order Created",
        content: notification.data,
        status: "UNREAD",
        updatedAt: new Date(), // Add this line
        createdAt: new Date()  // Add this line
      }
    });

    console.log("Base notification created:", baseNotification);

    // Get all admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.SYSTEM_ADMIN, Role.ADMIN]
        }
      },
      select: {
        id: true
      }
    });

    console.log("Found admin users:", adminUsers);

    // Create notification records for each admin
    const userNotifications = await Promise.all(
      adminUsers.map((user) =>
        prisma.notification.create({
          data: {
            templateId: "order_created",
            channels: "websocket",
            subject: "New Order Created",
            content: notification.data,
            status: "UNREAD",
            userId: user.id,
            updatedAt: new Date(), // Add this line
            createdAt: new Date()  // Add this line
          }
        })
      )
    );

    console.log("User notifications created:", userNotifications);

    // Emit socket notification
    const io = initSocketServer();
    if (io) {
      io.to('admins').emit('orderNotification', notification.data);
      console.log("Socket notification emitted to admins");
    }

    return true;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
}