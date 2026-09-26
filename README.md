# GitHub Profile Analyzer

Masukkan username GitHub, lalu lihat profil, komposisi repository, dan
kelengkapan metadata-nya.

App ini **tidak memberi skor, tidak memberi grade, dan tidak memberi nilai
"bagus" atau "buruk"**. Semua angka yang ditampilkan adalah fakta yang bisa
kamu cek sendiri di halaman GitHub. Kalau ada repo yang belum punya lisensi,
jumlahnya ditulis apa adanya.

## Fitur

### Ringkasan profil

Avatar, nama, bio, lokasi, perusahaan, dan link, ditambah empat statistik:
jumlah repo publik, followers, following, dan umur profil.

### Bahasa

Diagram batang persentase untuk setiap bahasa yang terdeteksi.

Perhitungannya hanya memakai **repo asli**. Fork tidak dihitung, karena
sebuah fork di luar repo sendiri tidak menggambarkan kemampuan. Warna
mengikuti kategori linguist yang dipakai GitHub, dengan warna netral untuk
bahasa yang tidak ada di daftar.

### Komposisi repository

Memisahkan karya sendiri dari fork, plus repo yang sudah di-archive, lalu
mencocokkannya dengan jumlah repo yang dilaporkan GitHub. Kalau ada
selisih, selisih itu ditampilkan, bukan disembunyikan.

### Aktivitas

Berapa banyak repo yang benar-benar menerima **push** dalam 30, 90, dan 365
hari terakhir, serta hari sejak push terakhir.

Yang dihitung adalah push, bukan waktu repo dibuat — repo lama yang masih
aktif akan terlihat aktif.

### Jangkauan

Total bintang, total fork, median bintang, dan repo dengan bintang
tertinggi. Jumlah repo yang belum punya bintang juga ditampilkan.

Menggunakan **median, bukan rata-rata** dengan alasan yang dipakai juga di
UI: distribusi bintang sangat tidak merata, jadi satu repo populer bisa
membuat rata-rata terlihat jauh lebih baik dari kenyataannya.

### Kelengkapan metadata

Empat pemeriksaan per repo — deskripsi, lisensi, topics, homepage — dengan
jumlah repo yang sudah terisi, jumlah yang belum, dan bar pengisiannya.
Ditambah kelengkapan profil: bio, lokasi, dan link atau perusahaan.

Bagian ini biasanya paling berguna kalau kamu memakai app untuk
menilai portofolio sendiri, karena yang biasanya kurang justru hal-hal
yang paling murah diperbaiki.

### Daftar repository

Semua repo yang terambil, dengan dua pilihan urutan: paling banyak bintang
(urutan bawaan) atau paling baru di-push. Tiap kartu menampilkan badge
`fork` dan `archived` kalau relevan, plus bintang, fork, bahasa, lisensi,
dan maksimal empat topic.

## Cara pakai

Prasyarat: **Node.js 20.9.0 atau lebih baru**, sesuai syarat `engines` Next.js.

```bash
npm install
```

Salin contoh environment lalu isi tokennya. Token bersifat opsional —
lihat bagian [Environment variable](#environment-variable) di bawah.

```bash
cp .env.example .env.local
```

Jalankan server pengembangan:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000), ketik username GitHub,
lalu klik **Analyze**.

## Environment variable

| Nama | Wajib | Keterangan |
| --- | --- | --- |
| `GITHUB_TOKEN` | Tidak | Personal Access Token GitHub. Kosongkan dan app tetap jalan. |

### Soal token dan rate limit

| Situasi | Limit GitHub |
| --- | --- |
| Tanpa token | 60 request per jam per IP |
| Dengan token | 5.000 request per jam |

Hanya read access ke data publik. Untuk **classic PAT** centang scope
`public_repo`. **Fine-grained PAT** tidak membutuhkan scope tambahan, dan
sudah dipakai serta terverifikasi membaca data publik pada app ini.

Token dibaca hanya di server. Nilainya tidak pernah masuk ke HTML maupun
bundle JavaScript yang dikirim ke browser.

## API

### `GET /api/github`

| Parameter | Wajib | Keterangan |
| --- | --- | --- |
| `username` | Ya | Login GitHub, maksimal 39 karakter |

Contoh:

```
GET /api/github?username=torvalds
```

Respons sukses, dengan nilai contoh nyata dari sebuah profil beranggota 17
repository. `share` ditulis dua desimal di sini supaya mudah dibaca; di kode
nilainya masih pecahan mentah, yaitu jumlah repo berbahasa itu dibagi total
repo yang punya bahasa, tanpa membulatkan persen.

```jsonc
{
  "user": { "login": "contoh", "public_repos": 17 },
  "repos": [ { "name": "contoh-repo", "stargazers_count": 3 } ],
  "truncated": false, // true kalau repo melewati batas 500
  "analysis": {
    "language":    [ { "language": "HTML", "repos": 8, "stars": 8, "share": 0.57 } ],
    "composition": { "reported": 17, "analyzed": 17, "own": 17, "forks": 0, "archived": 0, "truncated": false },
    "activity":    { "last30": 11, "last90": 17, "last365": 17, "daysSincePush": 0 },
    "reach":       { "stars": 19, "forks": 0, "medianStars": 1, "topStars": 3, "zeroStarRepos": 1 },
    "metadata":    { "total": 17, "withDescription": 9, "withLicense": 0, "withTopics": 0, "withHomepage": 7 },
    "profile":     { "hasBio": true, "hasLocation": false, "hasLink": true, "ageYears": 1.9 }
  }
}
```

Kode error:

| Status | Arti |
| --- | --- |
| `400` | Username kosong atau formatnya tidak valid |
| `404` | Username GitHub tidak ditemukan |
| `429` | Rate limit GitHub tercapai |
| `500` | `GITHUB_TOKEN` tidak valid, atau kesalahan tak terduga |
| `502` | Gagal mengambil data dari GitHub |

Semua respons error berbentuk `{ "error": "pesan dalam bahasa Indonesia" }`.

## Stack

| Teknologi | Versi |
| --- | --- |
| Next.js | 16.3.6 |
| React | 19.2.8 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 |
| ESLint | 9.39.5 |

Beberapa catatan tentang pilihan teknisnya:

- **Route Handlers** (`app/api/github/route.ts`) dipakai untuk endpoint ini,
  bukan API Routes Pages Router yang sudah deprecated.
- **Turbopack** sudah menjadi default untuk `next dev` dan `next build` di
  Next.js 16, jadi tidak ada flag yang perlu ditambahkan.
- **Tiga runtime dependency saja**: `next`, `react`, `react-dom`. Tanpa
  library state management, tanpa ORM, tanpa HTTP client.
- **Tanpa chart library.** Diagram batang bahasa dibangun dari CSS murni,
  sehingga tidak menambah bobot bundle.
- **Geist** dimuat lewat `next/font`, dan avatar lewat `next/image` supaya
  otomatis teroptimasi. Karena itu `next.config.ts` perlu mengizinkan
  hostname `avatars.githubusercontent.com` untuk citra jarak jauh.
- TypeScript memakai alias `@/*` yang menunjuk ke root proyek.

## Struktur proyek

```
app/
  api/github/route.ts   Endpoint /api/github
  globals.css           Token desain dan konfigurasi Tailwind
  layout.tsx            Root layout, font, dan metadata
  page.tsx              Halaman utama: form dan komposisi semua section
components/
  activity.tsx          Panel aktivitas
  composition.tsx       Panel komposisi repository
  format.ts             Pemformat angka
  language-bars.tsx     Diagram batang bahasa
  metadata.tsx          Panel kelengkapan metadata
  profile-card.tsx      Kartu profil
  reach.tsx             Panel jangkauan
  repo-list.tsx         Daftar repository dengan pengurutan
  ui.tsx                Primitif bersama (Section, Card, Stat)
lib/
  analysis.ts          Derivasi statistik, fungsi murni tanpa I/O
  github.ts            Fetch ke GitHub API, pagination, dan pemetaan error
```

Pemisahan tanggung jawabnya: `lib/github.ts` hanya bicara dengan GitHub,
`lib/analysis.ts` hanya menghitung, dan `components/` hanya menampilkan.
`app/page.tsx` adalah satu-satunya berkas yang memanggil `fetch` ke
`/api/github`; setiap panel di `components/` menerima data yang sudah jadi
lewat props dan tidak melakukan request sendiri.

## Scripts

| Command | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm run start` | Menjalankan hasil build produksi |
| `npm run lint` | ESLint |

## Batasan yang diketahui

Bagian ini sengaja ada, supaya tidak ada yang terkejut.

- **Isi README tiap repository tidak diperiksa.** Membaca apakah sebuah repo
  punya README butuh satu request GitHub tambahan per repo, dan itu
  membutuhkan kuota yang jauh lebih besar. Karena itu bagian
  "kelengkapan" hanya memeriksa deskripsi, lisensi, topics, dan homepage.
- **Maksimal 500 repository per analisis** (5 halaman dikali 100). Profil dengan
  lebih dari itu akan terpotong, dan UI **menampilkan peringatan secara
  eksplisit** alih-alih diam-diam menampilkan angka yang tidak lengkap.
- **Hanya data publik, dan fork tidak masuk semua metrik.** Repository privat
  tidak pernah diakses. Fork tetap dihitung di komposisi dan tetap tampil di
  daftar repository, tapi bahasa, aktivitas, jangkauan, dan kelengkapan
  metadata dihitung dari repo asli saja.
- **Belum ada test suite.** Projekt ini belum punya pengujian otomatis;
  `npm run lint`, pemeriksaan tipe, dan build sudah bersih, sementara
  perilakunya diverifikasi manual dengan memanggil endpoint secara langsung
  pada beberapa profil.
- **Antarmuka belum pernah diuji di browser sungguhan.** Perilaku komponen
  terverifikasi lewat tipe dan render di server, tetapi belum ada yang
  memverifikasi tampilan visual maupun interaksi pengurutan daftar repo.
  Jalankan `npm run dev` untuk mencobanya.

## Deploy ke Vercel

1. Push repository ini ke GitHub.
2. Import repository tersebut di Vercel.
3. Atur `GITHUB_TOKEN` di **Settings → Environment Variables**. Jangan
   menaruhnya di file mana pun yang ikut ter-deploy atau ter-commit.
4. Deploy.

Aplikasi tetap berjalan di Vercel tanpa token, hanya dengan limit 60
request per jam per IP yang jauh lebih cepat habis.
