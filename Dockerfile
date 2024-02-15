# Stage 1: Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Runtime stage
FROM node:18-slim

WORKDIR /app

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

EXPOSE 8080

CMD ["node", "./dist/main.js"]
