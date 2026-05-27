# Single-stage Dockerfile untuk Nusantara Trails
# Pendekatan sederhana: semua dependency lengkap dalam satu image
# Trade-off: image lebih besar (~1GB) tapi tidak ada masalah missing module

FROM node:22-alpine

WORKDIR /app

# Install dependency untuk native module (mariadb driver butuh ini)
RUN apk add --no-cache python3 make g++ libc6-compat

# Salin file manifest dan install semua dependency
COPY package.json package-lock.json* ./
RUN npm install

# Salin seluruh source code aplikasi
COPY . .

# Generate Prisma client (wajib sebelum build)
RUN npx prisma generate

# Environment placeholder untuk build — nilai sebenarnya di-inject saat runtime
ENV NEXTAUTH_SECRET=build-placeholder
ENV NEXTAUTH_URL=http://localhost:3000
ENV DATABASE_URL=mysql://placeholder:placeholder@localhost:3306/placeholder

# Build Next.js untuk produksi
RUN npm run build

# Buat direktori upload yang akan menerima file foto dari penyedia
RUN mkdir -p /www/uploads

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

# Jalankan via npm start agar Next.js + Prisma client + semua dependency tersedia
CMD ["npm", "start"]
