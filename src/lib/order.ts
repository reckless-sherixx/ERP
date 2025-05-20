import { prisma } from "@/lib/prisma";

export async function createOrder(orderData: any) {
  try {
    const order = await prisma.order.create({
      data: orderData,
    });
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function updateOrder(id: string, orderData: any) {
  try {
    const order = await prisma.order.update({
      where: { id },
      data: orderData,
    });
    return order;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
}

export async function getOrder(id: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: true,
      },
    });
    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
}

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: true,
      },
    });
    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}
