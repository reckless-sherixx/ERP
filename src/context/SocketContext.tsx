"use client";

import { initSocketClient } from "@/lib/socket";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  reconnect: () => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  reconnect: () => {},
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { data: session, status } = useSession();

  const handleConnection = useCallback((socketInstance: Socket) => {
    if (!session?.user) return;

    const isAdmin = session.user.role === Role.SYSTEM_ADMIN || session.user.role === Role.ADMIN;
    
    if (isAdmin) {
      console.log('Admin user connecting, joining room...');
      socketInstance.emit('join', {
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        timestamp: new Date().toISOString()
      });
    }
  }, [session]);

  const initSocket = useCallback(() => {
    if (!session?.user) return null;

    const socketInstance = initSocketClient();
    if (!socketInstance) return null;

    socketInstance.on('connect', () => {
      console.log('Socket connected with ID:', socketInstance.id);
      setIsConnected(true);
      handleConnection(socketInstance);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected:', socketInstance.id);
      setIsConnected(false);
    });

    socketInstance.on('reconnect', () => {
      console.log('Socket reconnected');
      handleConnection(socketInstance);
    });

    return socketInstance;
  }, [session, handleConnection]);

  const reconnect = useCallback(() => {
    if (socket) {
      socket.connect();
    } else {
      const newSocket = initSocket();
      if (newSocket) setSocket(newSocket);
    }
  }, [socket, initSocket]);

  useEffect(() => {
    if (status === 'loading') return;

    const socketInstance = initSocket();
    if (socketInstance) {
      setSocket(socketInstance);
      
      // If already connected handle connection
      if (socketInstance.connected) {
        handleConnection(socketInstance);
      }
    }

    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('reconnect');
      }
    };
  }, [status, initSocket, handleConnection]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, reconnect }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};