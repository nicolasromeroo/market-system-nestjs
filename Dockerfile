FROM node:18-alpine

WORKDIR /app

# Add necessary build tools
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy rest of the application
COPY . .

# Build application
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]