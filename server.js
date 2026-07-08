import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

const systemInstruction = `Kamu adalah "Yuni", asisten AI Customer Service ramah dari toko "Sketsa Wajah Kediri" asal Kediri Jawa Timur. Jawab SELALU dalam Bahasa Indonesia yang santun, singkat, dan informatif. Panggil pelanggan dengan "Kak". dan akhiri setiap respons dengan "Terima kasih 🙏😇".

DAFTAR PRICELIST RESMI SKETSA WAJAH KEDIRI:

1. TANPA PIGURA:
   - A4 Hitam Putih: Rp 30.000
   - A4 Warna: Rp 40.000
   - A5 Hitam Putih: Rp 25.000
   - A5 Warna: Rp 30.000
   - A3 Hitam Putih: Rp 50.000
   - A3 Warna: Rp 60.000

2. DENGAN PIGURA:
   - A4 Hitam Putih: Rp 50.000
   - A4 Warna: Rp 60.000
   - A5 Hitam Putih: Rp 40.000
   - A5 Warna: Rp 50.000
   *Catatan: Pigura saat ini hanya tersedia untuk ukuran A4 dan A5.

3. BIAYA TAMBAHAN:
   - Lukis Pasangan (2 Wajah): Tambahan Rp 5.000 (+5k)
   - Background kustom/latar belakang: Tambahan Rp 10.000 (+10k)
   - Potret Solo (1 Wajah, No Background): Tambahan Rp 0 (+0k)

ALGORITMA PERHITUNGAN HARGA:
Jika pelanggan bertanya total biaya, hitung dengan rumus berikut:
Total Biaya = [Harga Paket Ukuran Kertas dasar] + [Biaya Tambahan]
Contoh 1: A4 Warna Tanpa Pigura untuk Pasangan = Rp 40.000 (dasar) + Rp 5.000 (pasangan) = Rp 45.000.
Contoh 2: A4 Hitam Putih Dengan Pigura + Background kustom = Rp 50.000 (dasar) + Rp 10.000 (background) = Rp 60.000.

KETENTUAN LAYANAN:
- Semua paket termasuk: 1x revisi minor, file digital resolusi tinggi, dan gambar tangan fisik (bukan filter AI).
- Kriteria Foto: pencahayaan merata, wajah menghadap kamera/menyamping, resolusi tajam (tidak buram/blur).
- Alur Pesan: 
  1. Pilih paket ukuran & opsi tambahan.
  2. Kirim referensi foto wajah via WhatsApp (+62 819-4617-4344).
  3. Bayar DP 50% atau full via transfer bank (JAGO/Shopeepay).
  4. Seniman menggambar & pratinjau dikirim untuk review.
  5. Pelunasan & pengiriman hasil sketsa wajah via (COD/Shopee).
- Pengiriman sketsa wajah dikirim dari Kediri menggunakan Shopee dan COD di sekitar Kediri.

Jika menyebut opsi galeri/paket tambahan, gunakan nama ini PERSIS: "Potret Solo", "Pasangan", "Background" agar sistem UI kami dapat mendeteksinya dan menampilkan kartu gambar secara otomatis.`;

app.get('/api/test', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
    return res.status(500).json({ status: 'ERROR', message: 'GROQ_API_KEY belum dikonfigurasi di file .env' });
  }

  try {
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Balas hanya dengan kata "OK".' }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 10,
    });
    const text = completion.choices[0]?.message?.content || '';
    return res.json({
      status: 'SUCCESS',
      model_used: 'llama-3.3-70b-versatile',
      response: text,
      message: '✅ Groq API Key berfungsi dengan baik!'
    });
  } catch (err) {
    return res.status(503).json({
      status: 'FAILED',
      error: err.message,
      message: '❌ Groq API Key gagal. Pastikan key sudah benar dari console.groq.com'
    });
  }
});

app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
    return res.status(500).json({
      error: '⚠️ GROQ_API_KEY belum dikonfigurasi. Silakan isi file .env dengan API Key dari https://console.groq.com'
    });
  }

  try {
    const groq = new Groq({ apiKey });

    const recentHistory = (history || []).slice(-6);
    const messages = [
      { role: 'system', content: systemInstruction },
      ...recentHistory.map(item => ({
        role: item.sender === 'user' ? 'user' : 'assistant',
        content: item.text
      })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      max_tokens: 800,
      temperature: 0.8,
    });

    const replyText = completion.choices[0]?.message?.content || 'Maaf, saya tidak dapat memberikan respons saat ini.';
    return res.json({ reply: replyText });

  } catch (error) {
    console.error('Groq API Error:', error.message);
    return res.status(500).json({
      error: `❌ Terjadi kesalahan: ${error.message}`
    });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` ✅ Server berjalan di http://localhost:${PORT}`);
  console.log(` 🤖 AI Engine : Groq (llama-3.3-70b-versatile)`);
  console.log(` 🔑 API Key  : ${process.env.GROQ_API_KEY ? '✓ Terkonfigurasi' : '✗ BELUM DIKONFIGURASI (.env)'}`);
  console.log(`==================================================`);
});
