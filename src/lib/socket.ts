import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import type { Server as HTTPServer } from 'http';

let io: SocketIOServer | null = null;
let httpServer: HTTPServer;

export const initSocketServer = () => {
  if (!io) {
    httpServer = createServer();
    
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('authenticate', async (userId: string) => {
        try {
          socket.join('admins');
          console.log(`User ${userId} authenticated and joined admins room`);
        } catch (error) {
          console.error('Authentication error:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    const port = parseInt(process.env.SOCKET_PORT || '3001', 10);
    httpServer.listen(port, () => {
      console.log(`Socket.IO server running on port ${port}`);
    });
  }
  return io;
};