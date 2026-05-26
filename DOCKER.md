# Dokumentasi Docker — Nusantara Trails

## Daftar Isi
1. [Komponen Platform per Kontainer](#1-komponen-platform-per-kontainer)
2. [Cara Docker Membantu Deployment](#2-cara-docker-membantu-deployment)
3. [Diagram Arsitektur Sistem](#3-diagram-arsitektur-sistem)
4. [Panduan Menjalankan](#4-panduan-menjalankan)

---

## 1. Komponen Platform per Kontainer

Platform Nusantara Trails dikemas dalam **3 kontainer** yang saling terhubung melalui internal Docker network bernama `nusantara_net`.

### Kontainer 1 — `nusantara_db` (Database)

| Atribut | Nilai |
|---|---|
| Image | `mariadb:11` |
| Port internal | `3306` (tidak terekspos ke host) |
| Volume | `db_data:/var/lib/mysql` |

**Tanggung jawab:** Menyimpan seluruh data persisten platform — user, destinasi, paket wisata, dan booking — dalam database relasional MariaDB.

Saat pertama kali dijalankan, container ini mengeksekusi `docker/init.sql` secara otomatis untuk membuat database `nusantara_trails` dengan encoding `utf8mb4`. Container ini memiliki **health check** sehingga kontainer `app` tidak akan mulai sampai database benar-benar siap menerima koneksi.

---

### Kontainer 2 — `nusantara_app` (Aplikasi Next.js)

| Atribut | Nilai |
|---|---|
| Image | Dibangun dari `Dockerfile` (custom) |
| Port internal | `3000` (tidak terekspos ke host) |
| Volume | `uploads_data:/www/uploads` |

**Tanggung jawab:** Menjalankan seluruh logika aplikasi web — Server Components, API Routes, autentikasi NextAuth, dan operasi database via Prisma ORM.

Dockerfile menggunakan **multi-stage build** dengan 3 tahap:

```
Stage 1 (deps)     → Install npm dependencies
Stage 2 (builder)  → Build Next.js, generate Prisma client
Stage 3 (runner)   → Image produksi ringan (~200MB vs ~1GB tanpa multi-stage)
```

`next.config.mjs` dikonfigurasi dengan `output: 'standalone'` sehingga hasil build sudah mencakup semua file yang dibutuhkan tanpa perlu `node_modules` penuh di image produksi.

---

### Kontainer 3 — `nusantara_nginx` (Web Server)

| Atribut | Nilai |
|---|---|
| Image | `nginx:alpine` |
| Port eksternal | `80:80` (satu-satunya port yang terekspos ke internet) |
| Volume | `uploads_data:/www/uploads` (read-only) |

**Tanggung jawab:** Bertindak sebagai *reverse proxy* dan *static file server*.

Nginx memiliki dua tugas utama:

1. **Proxy ke Next.js** — Semua request HTTP diteruskan ke `http://app:3000`. Nginx menambahkan header `X-Real-IP`, `X-Forwarded-For`, dan menangani upgrade untuk koneksi WebSocket.

2. **Serve file upload langsung** — Request ke `/uploads/*` dilayani langsung dari volume `uploads_data` tanpa melewati Next.js, yang jauh lebih efisien untuk file statis seperti foto paket wisata.

---

### Hubungan Antar Kontainer

```
INTERNET
    │
    ▼
[nusantara_nginx] :80
    │  /uploads/*  ──────────────────► volume uploads_data
    │  semua request lain
    │  proxy_pass
    ▼
[nusantara_app] :3000
    │  prisma query
    ▼
[nusantara_db] :3306
    │
    ▼
volume db_data
```

| Koneksi | Protokol | Keterangan |
|---|---|---|
| nginx → app | HTTP (`proxy_pass http://app:3000`) | DNS internal Docker — nama service `app` otomatis resolve |
| app → db | TCP MySQL (`mysql://db:3306`) | DNS internal Docker — nama service `db` otomatis resolve |
| nginx → uploads_data | Volume mount (read-only) | Nginx baca file foto langsung tanpa lewat app |
| app → uploads_data | Volume mount (read-write) | App tulis file foto hasil upload penyedia |

---

## 2. Cara Docker Membantu Deployment

### a. Konsistensi Lingkungan

Tanpa Docker, menjalankan platform ini di mesin baru memerlukan instalasi manual: Node.js versi yang tepat, MariaDB dengan konfigurasi tertentu, Nginx, dan pengaturan PATH yang benar. Perbedaan versi minor (misal Node 20 vs 22) dapat menyebabkan perilaku berbeda atau error yang sulit di-debug.

Dengan Docker, seluruh lingkungan — termasuk versi OS base image, Node.js, MariaDB, dan Nginx — didefinisikan secara eksplisit dalam file teks (`Dockerfile`, `docker-compose.yml`). Perintah `docker compose up --build` selalu menghasilkan lingkungan yang **identik** di laptop developer, CI/CD server, maupun VPS produksi.

### b. Isolasi Antar Service

Setiap kontainer berjalan dalam namespace-nya sendiri. Port database (3306) tidak terekspos ke luar — hanya container `app` yang dapat mengaksesnya melalui internal network `nusantara_net`. Jika container `nginx` mengalami error, database dan app tetap berjalan.

### c. Portabilitas

Seluruh konfigurasi platform cukup dengan menyalin direktori proyek + menjalankan dua perintah:
```bash
cp .env.example .env   # isi konfigurasi
docker compose up -d --build
```
Tidak ada instalasi software tambahan yang diperlukan di host selain Docker Engine.

### d. Pemisahan Rahasia (Secrets)

Semua nilai sensitif (password database, `NEXTAUTH_SECRET`) tidak di-hardcode di Dockerfile atau image. Nilainya diinjeksikan saat runtime melalui file `.env` yang **tidak pernah masuk ke repository** (tercantum di `.dockerignore` dan `.gitignore`).

### e. Reprodusibilitas dan Rollback

Karena image di-build dari Dockerfile yang di-version control, setiap commit memiliki snapshot lingkungan yang dapat di-rebuild kapan saja. Rollback ke versi sebelumnya cukup dengan `git checkout <commit>` dan `docker compose up --build`.

---

## 3. Diagram Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────────┐
│                          HOST / VPS                                  │
│                                                                     │
│   Port 80 ──────────────────────────────────────────────────────┐  │
│                                                                  │  │
│  ┌───────────────────────────────────────────────────────────┐  │  │
│  │              Docker Network: nusantara_net                 │  │  │
│  │                                                            │  │  │
│  │   ┌─────────────────────┐                                 │  │  │
│  │   │  nusantara_nginx     │◄────────────────────────────── ┘  │  │
│  │   │  (nginx:alpine)      │  Terima request dari internet      │  │
│  │   │                      │                                     │  │
│  │   │  /uploads/* ─────────┼──────────────────────┐            │  │
│  │   │  /* proxy_pass ──────┼──────────────┐        │            │  │
│  │   └─────────────────────┘              │        │            │  │
│  │                                         │        │            │  │
│  │   ┌─────────────────────┐              │        │            │  │
│  │   │  nusantara_app       │◄────────────┘        │            │  │
│  │   │  (Next.js 16)        │                       │            │  │
│  │   │                      │  Prisma ORM           │            │  │
│  │   │  - Server Components │────────────┐          │            │  │
│  │   │  - API Routes        │            │          │            │  │
│  │   │  - NextAuth          │  Write foto│          │ Read foto  │  │
│  │   │  - File Upload       │─────────┐  │          │            │  │
│  │   └─────────────────────┘         │  │          │            │  │
│  │                                    │  │          │            │  │
│  │   ┌─────────────────────┐          │  │  ┌───────────────┐  │  │
│  │   │  nusantara_db        │◄─────────┼──┘  │ uploads_data  │  │  │
│  │   │  (MariaDB 11)        │          │     │ (Docker Vol.) │  │  │
│  │   │                      │          └────►│               │  │  │
│  │   │  Tables:             │                │ foto-paket.jpg│  │  │
│  │   │  - User              │                └───────────────┘  │  │
│  │   │  - Destination       │                                    │  │
│  │   │  - TravelPackage     │  ┌───────────────┐                │  │
│  │   │  - Booking           │  │  db_data       │                │  │
│  │   └──────────┬───────────┘  │  (Docker Vol.)│                │  │
│  │              └─────────────►│               │                │  │
│  │                             └───────────────┘                │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Penjelasan Diagram

**Alur Request Normal (user mengakses platform):**
1. Browser mengirim HTTP request ke port 80 di host
2. Nginx menerima request dan memeriksa path:
   - Jika path dimulai `/uploads/` → baca file langsung dari volume `uploads_data` dan kembalikan ke browser
   - Jika path lainnya → forward ke `http://app:3000` via proxy
3. Container `app` (Next.js) memproses request, query ke `db` jika diperlukan
4. Response dikembalikan ke browser melalui Nginx

**Alur Upload Foto (penyedia upload foto paket):**
1. Form multipart dikirim ke `POST /api/packages`
2. Next.js menyimpan file ke `/www/uploads/` (volume `uploads_data`)
3. Path `/uploads/namafile.jpg` disimpan di database
4. Saat user membuka halaman, request ke `/uploads/namafile.jpg` dilayani langsung oleh Nginx dari volume yang sama

**Kenapa Nginx di depan Next.js?**
Next.js (Node.js) tidak dioptimalkan untuk melayani file statis secara efisien. Nginx menggunakan sendfile syscall dan cache kernel untuk melayani file statis jauh lebih cepat dengan konsumsi CPU minimal.

---

## 4. Panduan Menjalankan

### Prasyarat
- Docker Engine ≥ 24
- Docker Compose V2 (`docker compose` bukan `docker-compose`)

### Langkah Pertama Kali

```bash
# 1. Clone dan masuk direktori
cd /path/ke/nusantara-trails

# 2. Buat file .env dari template
cp .env.example .env
# Edit .env, isi DB_ROOT_PASSWORD, DB_PASSWORD, NEXTAUTH_SECRET, NEXTAUTH_URL

# 3. Build dan jalankan semua container
docker compose up -d --build

# 4. Tunggu database siap, lalu jalankan migrasi
docker compose exec app npx prisma migrate deploy

# 5. Seed data awal (superadmin, destinasi, paket sample)
docker compose exec app node prisma/seed.js
```

### Perintah Harian

```bash
# Lihat status container
docker compose ps

# Lihat log real-time
docker compose logs -f

# Hanya log container tertentu
docker compose logs -f app

# Restart satu container
docker compose restart app

# Stop semua container (data tetap di volume)
docker compose down

# Stop DAN hapus semua data (HATI-HATI: database ikut terhapus)
docker compose down -v
```

### Update Aplikasi

```bash
# Pull kode terbaru
git pull

# Rebuild image app dan restart
docker compose up -d --build app

# Jalankan migrasi database jika ada
docker compose exec app npx prisma migrate deploy
```

### Akun Default Setelah Seed

| Role | Email | Password |
|---|---|---|
| Superadmin | admin@nusantaratrails.com | Admin123! |
| Penyedia (demo) | penyedia@nusantaratrails.com | Penyedia123! |
