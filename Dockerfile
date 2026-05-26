# ============================================================
# Stage 1 — deps: Install dependencies saja (di-cache terpisah)
# ============================================================
FROM node:22-alpine AS deps

WORKDIR /app

# Copy file manifest dependensi
COPY package.json package-lock.json* ./

# npm install lebih toleran dari npm ci — tidak memerlukan lock file yang sempurna
RUN npm install


# ============================================================
# Stage 2 — builder: Build aplikasi Next.js
# ============================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Salin node_modules dari stage deps
COPY --from=deps /app/node_modules ./node_modules

# Salin seluruh source code
COPY . .

# Salin prisma schema lalu generate client (perlu ada sebelum build)
RUN npx prisma generate

# Variabel lingkungan minimum agar next build tidak error
# Nilai sebenarnya di-inject saat runtime via docker-compose
ENV NEXTAUTH_SECRET=build-placeholder
ENV NEXTAUTH_URL=http://localhost:3000
ENV DATABASE_URL=mysql://placeholder:placeholder@localhost:3306/placeholder

# Build Next.js dengan output standalone — menghasilkan bundle mandiri
# yang tidak membutuhkan seluruh node_modules di runtime
RUN npm run build


# ============================================================
# Stage 3 — runner: Image produksi yang ringan
# ============================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Buat user non-root untuk keamanan
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Buat direktori uploads dan beri kepemilikan ke user nextjs
RUN mkdir -p /www/uploads && chown nextjs:nodejs /www/uploads

# Salin artefak build standalone dari stage builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
