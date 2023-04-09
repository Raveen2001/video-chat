FROM node:18-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY apps/client/package*.json ./apps/client/
COPY apps/server/package*.json ./apps/server/

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Install production dependencies
RUN npm install --omit=dev


FROM node:18-alpine AS runner
WORKDIR /app
RUN npm install -g turbo
 
# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 qwik
USER qwik

# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json /app/turbo.json ./


# Copy client build
COPY --from=builder /app/apps/client/dist ./apps/client/dist
COPY --from=builder /app/apps/client/server ./apps/client/server
COPY --from=builder /app/apps/client/package*.json ./apps/client/


# Copy server build
COPY --from=builder /app/apps/server/dist  ./apps/server/dist
COPY --from=builder /app/apps/server/package*.json ./apps/server/

# Expose port
EXPOSE 3000 5000
 
# Start the app
CMD npm run start