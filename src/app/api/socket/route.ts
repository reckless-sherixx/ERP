import { NextResponse } from 'next/server';
import { initSocketServer } from '@/lib/socket';

export async function GET(req: Request) {
  try {
    const io = initSocketServer();
    
    if (!io) {
      return NextResponse.json(
        { error: "Failed to initialize socket server" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Socket server running" },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  try {
    const io = initSocketServer();
    
    if (!io) {
      return NextResponse.json(
        { error: "Socket server not initialized" },
        { status: 500 }
      );
    }

    const notificationData = await req.json();

    // Emit the notification to all connected admin clients
    io.to('admins').emit('orderNotification', {
      orderNumber: notificationData.data.orderNumber,
      customerName: notificationData.data.customerName,
      totalPrice: notificationData.data.totalPrice,
      createdBy: notificationData.data.createdBy,
      timestamp: new Date()
    });

    return NextResponse.json(
      { message: "Notification sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Socket notification error:', error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';