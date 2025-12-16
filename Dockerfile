# ---------- 1. 依赖安装阶段 ----------
FROM node:22-alpine AS deps

WORKDIR /app

# 只拷贝依赖相关文件，利用 Docker 缓存
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# 根据你实际用的包管理器选择其一
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  else npm install; \
  fi

# ---------- 2. 构建阶段 ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production

RUN npm run build

# ---------- 3. 运行阶段 ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# 仅拷贝运行所需文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "run", "start"]
