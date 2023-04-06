FROM node:18-alpine
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
COPY . .
RUN npm install -g pnpm
RUN pnpm install
RUN pnpm run build
 
CMD pnpm start
