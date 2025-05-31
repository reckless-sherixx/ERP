import { Server } from 'socket.io';

export const config = {
  api: {
    bodyParser: false,
  },
};

let io: Server;

export function getIO() {
  if (!io) {
    io = new Server({
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });
  }
  return io;
}