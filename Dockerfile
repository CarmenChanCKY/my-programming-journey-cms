## FOR AWS EC2 INSTANCE DEPLOYMENT

# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# 接收來自 docker-compose 的環境變數
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json ./
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
COPY . .
# 執行你指定的編譯指令
RUN npm run build

# --- Stage 2: Production Target ---
FROM alpine:latest
WORKDIR /usr/share/nginx/html
# 複製編譯出來的靜態檔案（Vite 預設為 dist）
COPY --from=builder /app/dist .
CMD ["sh", "-c", "sleep infinity"]