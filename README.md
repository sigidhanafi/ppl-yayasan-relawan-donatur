This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

-----

### Proyek Yayasan Relawan & Donatur

Proyek ini adalah aplikasi web untuk mengelola kegiatan yayasan, relawan, dan donasi. Aplikasi ini dibangun dengan **Next.js** dan menggunakan **PostgreSQL** sebagai database, yang semuanya berjalan di dalam kontainer Docker.

-----

### Persyaratan

* **Docker** dan **Docker Compose**
* **Node.js** (untuk menjalankan skrip `npm` di host, jika diperlukan)

-----

### Instalasi dan Setup

#### 1\. Konfigurasi Lingkungan

Buat file **`.env`** di root proyek Anda dengan variabel lingkungan berikut. Variabel ini digunakan oleh Docker Compose untuk mengonfigurasi database dan Next.js.

```ini
# PostgreSQL
POSTGRES_USER=appuser
POSTGRES_PASSWORD=password
POSTGRES_DB=appdb

# Next.js
# DATABASE_URL: Pastikan hostnya sesuai dengan nama layanan Docker (db)
DATABASE_URL="postgresql://appuser:password@db:5432/appdb?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ganti-dengan-string-acak-yang-kuat"
NEXTAUTH_DEBUG=true

# Google Auth (opsional, jika Anda menggunakan login Google)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

#### 2\. Jalankan Aplikasi

Jalankan perintah Docker Compose di terminal dari root proyek Anda:

```bash
docker compose up --build
```

Perintah ini akan:

* Membangun citra Docker untuk layanan **`web`** (Next.js) berdasarkan `Dockerfile`.
* Mengunduh citra **`postgres:16-alpine`** untuk layanan **`db`**.
* Menjalankan kontainer **`db`** dan menunggu hingga database siap (`healthcheck`).
* Menjalankan kontainer **`web`** dan secara otomatis menginstal dependensi, menjalankan migrasi Prisma (`prisma migrate dev`), dan memulai server pengembangan.
* Aplikasi akan dapat diakses di `http://localhost:3000`.

-----

### Mengakses Server dan Database

* **Aplikasi Web**: Buka `http://localhost:3000` di browser Anda.
* **Database (PostgreSQL)**: Anda dapat terhubung ke database dari host Anda di `localhost:5432`.
* **Masuk ke Kontainer**: Untuk menjalankan perintah Prisma atau skrip lainnya di dalam kontainer, gunakan perintah berikut:

    ```bash
    docker compose exec web sh
    ```

-----

### Menjalankan Skrip Seeding

Setelah aplikasi berjalan dan migrasi diterapkan, Anda dapat mengisi database dengan data dummy dengan menjalankan perintah berikut di terminal yang terpisah:

```bash
docker compose exec web npx prisma db seed
```

-----

### Struktur Layanan

Aplikasi ini terdiri dari dua layanan utama:

* **`db`**: Kontainer database **PostgreSQL** yang menyimpan data aplikasi. Data disimpan dalam volume `yayasan-indo-data` agar persisten.
* **`web`**: Kontainer **Next.js** yang menjalankan aplikasi web. Kontainer ini bergantung pada layanan `db` untuk memastikan database sudah siap sebelum aplikasi dimulai.
