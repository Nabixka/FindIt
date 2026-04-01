# 🔎 FindIt

Aplikasi web untuk melaporkan **barang hilang** dan **barang ditemukan**, dibangun menggunakan **Node.js 22, Vue, dan PostgreSQL**.

FindIt membantu pengguna menemukan kembali barang yang hilang atau melaporkan barang yang ditemukan dengan sistem yang sederhana dan cepat.

---

# ✨ Fitur

## 🔍 Lapor Barang Hilang
- Membuat laporan barang hilang
- Upload foto barang
- Menambahkan deskripsi detail
- Menentukan lokasi
- Menyertakan informasi kontak

## 🎒 Lapor Barang Ditemukan
- Melaporkan barang yang ditemukan
- Upload foto barang
- Menambahkan lokasi
- Menyertakan informasi kontak penemu

## 📄 Daftar & Pencarian Barang
- Melihat daftar barang hilang
- Melihat daftar barang ditemukan
- Fitur pencarian barang

## 📞 Menghubungi Pelapor
- Tombol langsung untuk menghubungi pelapor
- Integrasi WhatsApp berdasarkan nomor yang tersedia
- Mempermudah proses klaim barang

## 🖼️ Upload Gambar
- Upload gambar menggunakan **Multer**
- Penyimpanan file di folder `/uploads`

---

# 🏗️ Library yang Digunakan

## Backend
- Node.js 22
- Express.js
- Pg
- Multer
- dotenv
- Nodemailer
- Resend
- Hash
- JWT Bearer
- Arsitektur MVC

## Frontend
- Vue
- Vite
- Capacitor (Untuk Android)
- Iconify
- Tailwind
- Motion-v
- Axios
- Leaflet
- vue-router

## Database
- PostgreSQL

---

# 📂 Struktur Project
```bash
findit/
│
├── backend/
│ ├── controllers/
│ ├── models/
│ ├── routers/
│ ├── middlewares/
│ ├── database/
│ ├── uploads/
│ ├── server.js
│ └── package.json
│
└── frontend/
├── src/
├── public/
├── App.vue
├── main.js
└── package.json
```

---

# ⚙️ Instalasi & Menjalankan Project

- Tekan "<> Code" Di github ini dan Download ZIP
- Extract dan Masuk ke VS Code
- Masuk Ke Folder Project
```powershell
# Masuk Ke Project
cd Findit

# Instalasi Backend
cd backend
npm install
node migrate.js
node server.js

# Instalasi Frontend
cd frontend
npm install
npm run build

npx cap add android
npx cap sync
npx cap open android

```

# ⚙️ ENV 

## Frontend
```bash
VITE_API_URL = YOUR_API_URL
```

## Backend
```bash
DB_HOST = YOUR_DB_HOST
DB_PASSWORD = YOUR_DB_PASSWORD
DB_PORT = 5432
DB_USER = YOUR_DB_USER

PORT = 3000

MODE = "dev" # else if you use resend

RESEND_API_KEY = "YOUR_RESEND_API KEY"  # if you not use resend, comment the OTP code for resend

EMAIL_USER = "YOUR_EMAIL"
EMAIL_PASS = "YOUR_EMAIL_APP_PASS"
```

- Here For Email "myaccount.google.com/apppasswords"
- If You Can't Configuration The Email Please Contact Me

# URL

- Menggunakan Cloudflared Agar Menjadi HTTPS
## Download Di Windows Powershell sebagai Admin
```powershell
winget install --id Cloudflare.cloudflared

# Login
cloudflared tunnel login

cloudflared tunnel --url http://localhost:3000

```

Or Maybet Just Deploy For Static URL
