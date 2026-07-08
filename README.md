# Sketsa Wajah Studio - Jasa Sketsa Wajah & Chat AI Gemini

Aplikasi website katalog produk jasa layanan sketsa wajah premium dengan asisten AI pintar (customer support) terintegrasi **Google Gemini API** (`gemini-1.5-flash`). Dibuat menggunakan **React + Vite** di sisi frontend dan **Express** di sisi backend.

## Fitur Utama
1. **Showcase Landing Page Premium**: Desain artistik modern gelap (dark mode) dengan aksen warna gold, slate, dan indigo.
2. **Katalog Produk Terfilter**: Menampilkan detail layanan sketsa pensil klasik, lukisan digital, cat air, karikatur kustom, dan siluet minimalis dengan filter instan.
3. **Floating Chat Widget**: Gelembung chat interaktif yang dapat di-expand menjadi panel obrolan dengan asisten AI bernama **Seno**.
4. **Seno (AI Customer Service)**:
   - Terlatih melalui *System Instructions* untuk memahami detail seluruh katalog produk (harga, durasi, kriteria foto) dan memandu alur pemesanan.
   - **Quick Action Replies**: Tombol saran cepat ("Daftar Harga", "Rekomendasi Kado", "Cara Kirim Foto") untuk memicu pertanyaan otomatis.
   - **Smart Context Integration**: Klik "Tanya Detail ke Asisten AI" pada kartu katalog untuk membuka chat dan menanyakan produk tersebut secara spesifik.
   - **Inline Product Card Rendering**: Ketika AI Seno menyebutkan nama produk tertentu dalam teks obrolan, aplikasi secara dinamis me-render kartu produk mini lengkap dengan link WhatsApp di bawah pesan.
5. **Secure API Key Proxy**: Seluruh API key diproses secara aman di backend Express (`server.js`) lewat variabel lingkungan `.env`, menghindari kebocoran API key di sisi klien (frontend).

---

## Langkah Instalasi & Cara Menjalankan

### Prerequisites
Pastikan Anda sudah menginstal:
* [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan)
* Akun Google untuk mendapatkan [Gemini API Key](https://aistudio.google.com/) gratis.

### 1. Dapatkan API Key Gemini
1. Buka [Google AI Studio](https://aistudio.google.com/).
2. Buat API key baru.

### 2. Setup Proyek
1. Buka folder proyek ini di terminal:
   ```bash
   cd C:\Users\PC\.gemini\antigravity\scratch\sketsa-wajah-chat
   ```
2. Instal semua dependensi frontend & backend:
   ```bash
   npm install
   ```

### 3. Konfigurasi Variabel Lingkungan
1. Duplikat atau edit file `.env` di root folder proyek.
2. Masukkan API Key Gemini Anda:
   ```env
   PORT=5000
   GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere...
   ```

### 4. Jalankan Aplikasi
Jalankan frontend (Vite) dan backend (Express) secara bersamaan dalam mode development:
```bash
npm run dev
```

* **Frontend** akan berjalan di: `http://localhost:5173`
* **Backend** akan berjalan di: `http://localhost:5000`
* Request API dari frontend ke `/api/*` secara otomatis di-proxy oleh Vite ke port 5000.

### 5. Build untuk Produksi (Opsional)
Untuk mengompilasi React menjadi aset statis dan menjalankannya melalui server Express:
```bash
npm run build
npm start
```
Aplikasi yang sudah di-build dapat diakses langsung pada port server utama di `http://localhost:5000`.

---

## Struktur Folder Utama
* `server.js` - Server Express & Integrasi Gemini SDK.
* `vite.config.js` - Konfigurasi port Vite & proxy API.
* `src/App.jsx` - Halaman landing utama, state chat, dan logika inisialisasi obrolan.
* `src/components/` - Komponen React (`Catalog`, `ProductCard`, `ChatWidget`, `ChatPanel`).
* `src/data/products.js` - JSON data katalog produk sketsa wajah.
* `src/index.css` - Desain sistem styling premium.
