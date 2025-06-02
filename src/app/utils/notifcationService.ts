import { prisma } from "@/lib/prisma";
import axios from "axios";
import { Role } from "@prisma/client";

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

    // Get only admin users
    const adminUsers = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.SYSTEM_ADMIN, Role.ADMIN]
        }
      },
      select: {
        id: true,
        role: true
      }
    });

    console.log("Found admin users:", adminUsers);

    // Store notifications only for admin users
    await Promise.all(
      adminUsers.map((user) =>
        prisma.notification.create({
          data: {
            templateId: "order_created",
            channels: "websocket",
            subject: "New Order Created",
            content: notification.data,
            status: "UNREAD",
            userId: user.id
          }
        })
      )
    );

    // Emit socket notification with retries
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;

    while (retryCount < maxRetries) {
      try {
        const socketResponse = await axios.post('http://localhost:3001/notify', {
          event: 'orderNotification',
          data: {
            ...notification,
            forAdminsOnly: true
          }
        }, {
          timeout: 5000
        });

        if (socketResponse.data.success) {
          console.log(`Notification sent to ${socketResponse.data.clientCount} admin users`);
          return true;
        }

        console.log("Retrying notification delivery...");
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retryCount++;
      } catch (error) {
        console.error(`Notification retry ${retryCount + 1} failed:`, error);
        retryCount++;
        if (retryCount === maxRetries) {
          console.error("Max retries reached");
          return false;
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    return false;
  } catch (error) {
    console.error("Error creating notification:", error);
    return false;
  }
}