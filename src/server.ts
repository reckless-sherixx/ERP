import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Constants
const NOTIFICATION_ROOM = 'notifications-room';

const app = express();
const httpServer = createServer(app);



// Configure Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  path: '/socket.io'
});

// Add middleware
app.use(cors());
app.use(express.json());

const ADMIN_NOTIFICATION_ROOM = 'admin-notifications';
// Track connected users and their details
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', {
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });

  socket.on('join', (userData) => {
    console.log('Join request received:', userData);

    if (userData.role === 'SYSTEM_ADMIN' || userData.role === 'ADMIN') {
      // Remove any existing connections for this user
      for (const [socketId, user] of connectedUsers.entries()) {
        if (user.userId === userData.userId) {
          const existingSocket = io.sockets.sockets.get(socketId);
          if (existingSocket) {
            existingSocket.leave(ADMIN_NOTIFICATION_ROOM);
            connectedUsers.delete(socketId);
          }
        }
      }

      // Add new connection
      socket.join(ADMIN_NOTIFICATION_ROOM);
      connectedUsers.set(socket.id, {
        ...userData,
        joinedAt: new Date().toISOString(),
        room: ADMIN_NOTIFICATION_ROOM
      });
      
      console.log('Admin joined notification room:', {
        socketId: socket.id,
        user: userData,
        timestamp: new Date().toISOString()
      });

      // Update room size for all admin clients
      const roomSize = io.sockets.adapter.rooms.get(ADMIN_NOTIFICATION_ROOM)?.size || 0;
      io.to(ADMIN_NOTIFICATION_ROOM).emit('room-updated', {
        room: ADMIN_NOTIFICATION_ROOM,
        userCount: roomSize
      });

      // Send confirmation to the client
      socket.emit('joined', {
        status: 'success',
        room: ADMIN_NOTIFICATION_ROOM,
        userCount: roomSize
      });
    }
  });

  socket.on('disconnect', (reason) => {
    const userData = connectedUsers.get(socket.id);
    console.log('Client disconnected:', {
      socketId: socket.id,
      user: userData,
      reason,
      timestamp: new Date().toISOString()
    });
    
    connectedUsers.delete(socket.id);
    
    // Update room size for remaining admin clients
    const roomSize = io.sockets.adapter.rooms.get(ADMIN_NOTIFICATION_ROOM)?.size || 0;
    io.to(ADMIN_NOTIFICATION_ROOM).emit('room-updated', {
      room: ADMIN_NOTIFICATION_ROOM,
      userCount: roomSize
    });
  });
});

// Update the notify endpoint to include more data
app.post('/notify', (req, res) => {
  try {
    const { event, data } = req.body;
    console.log('Notify endpoint called:', {
      event,
      data,
      timestamp: new Date().toISOString()
    });
    
    const roomSize = io.sockets.adapter.rooms.get(ADMIN_NOTIFICATION_ROOM)?.size || 0;
    console.log(`Active admin clients: ${roomSize}`);
    
    if (roomSize > 0) {
      // Include timestamp in the notification
      const notificationData = {
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now().toString()
      };

      io.to(ADMIN_NOTIFICATION_ROOM).emit(event, notificationData);
      console.log(`Notification emitted to ${roomSize} admin clients`);
      res.json({ success: true, clientCount: roomSize });
    } else {
      console.log('No admin clients connected');
      res.json({ success: false, message: 'No admin clients connected', clientCount: 0 });
    }
  } catch (error) {
    console.error('Error in notify endpoint:', error);
    res.status(500).json({ error: 'Failed to emit notification' });
  }
});

const PORT = process.env.SOCKET_PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
  console.log(`CORS enabled for: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`);
});