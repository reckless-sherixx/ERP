# Use official Node.js 18 image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install required system packages
RUN apk add --no-cache openssl

# Copy only dependency files first for better caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN npm install -g pnpm && pnpm install

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN pnpm build

# Expose the port
EXPOSE 3000

# Start the app
CMD ["pnpm", "start"]