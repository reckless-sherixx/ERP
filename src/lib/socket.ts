import { io as SocketIOClient } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initSocketClient = () => {
  if (!socket && typeof window !== 'undefined') {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    console.log('Initializing socket connection to:', url);

    socket = SocketIOClient(url, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      autoConnect: true,
      withCredentials: true,
      reconnection: true,
      forceNew: false,
      timeout: 10000
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.io.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
    });

    socket.io.on('reconnect', (attempt) => {
      console.log('Reconnected after', attempt, 'attempts');
    });
  }
  
  return socket;
};