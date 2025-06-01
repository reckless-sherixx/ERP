import { Role } from "@prisma/client"
import "next-auth"
import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'
import { Socket } from 'net'

declare module "next-auth" {
  interface User {
    role: Role
  }

  interface Session {
    user: User & {
      role: Role
    }
  }
}

// Add custom interface for server with io property
interface ServerWithIO extends NetServer {
  io?: SocketIOServer;
}

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: Socket & {
    server: ServerWithIO;
  }
}