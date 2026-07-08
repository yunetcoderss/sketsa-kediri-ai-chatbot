import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, MessageSquare, Menu, X, HelpCircle as HelpIcon } from 'lucide-react';
import Catalog from './components/Catalog';
import ChatWidget from './components/ChatWidget';
import ChatPanel from './components/ChatPanel';

const App = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('kediri_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat history', e);
      }
    }
    return [];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [faqOpenIndex, setFaqOpenIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(52);
  const isDragging = useRef(false);
  const sliderContainerRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMsg = {
        sender: 'bot',
        text: 'Halo! Selamat datang di **Sketsa Wajah Kediri**. 🎨 Saya **Yuni**, siap membantu Kakak memilih paket gambar sketsa wajah terbaik untuk kado wisuda, ulang tahun, atau dekorasi dinding.\n\nAda yang bisa saya bantu hari ini? Kakak bisa menanyakan pricelist, cara pemesanan, atau kriteria foto wajah yang bagus.',
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMsg]);
      setUnreadCount(1);
    }
  }, [messages.length]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('kediri_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (isChatOpen) {
      setUnreadCount(0);
    }
  }, [isChatOpen]);

  const updateSliderPos = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(6, Math.min(94, pct));
    setSliderPos(pct);
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleMouseMove = (e) => {
      if (isDragging.current) {
        updateSliderPos(e.clientX);
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging.current && e.touches[0]) {
        updateSliderPos(e.touches[0].clientX);
      }
    };

    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    let auto = 52;
    let dir = 1;
    let ticks = 0;
    const interval = setInterval(() => {
      if (isDragging.current) {
        clearInterval(interval);
        return;
      }
      auto += dir * 0.6;
      if (auto > 68 || auto < 36) dir *= -1;
      setSliderPos(auto);
      ticks++;
      if (ticks > 140) clearInterval(interval);
    }, 30);

    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      clearInterval(interval);
    };
  }, []);


  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const layer = document.getElementById('glitterLayer');
    if (!layer) return;

    const colors = ['#121212', '#3A3A3A', '#5B5B5B', '#8A8A8A'];
    let lastSpawn = 0;
    const minGap = 45;

    const spawnSparkle = (x, y) => {
      const s = document.createElement('div');
      s.className = 'sparkle';
      const size = 6 + Math.random() * 9;
      const angle = Math.random() * 360;
      const dx = (Math.random() - 0.5) * 46;
      const dy = (Math.random() - 0.5) * 46 - 14;
      const color = colors[Math.floor(Math.random() * colors.length)];

      s.style.width = size + 'px';
      s.style.height = size + 'px';
      s.style.setProperty('--c', color);
      s.style.setProperty('--r', angle + 'deg');
      s.style.setProperty('--dx', dx + 'px');
      s.style.setProperty('--dy', dy + 'px');
      s.style.left = x + 'px';
      s.style.top = y + 'px';

      layer.appendChild(s);
      s.addEventListener('animationend', () => s.remove());

      setTimeout(() => { if (s.parentNode) s.remove(); }, 1200);
    };

    const handleMove = (clientX, clientY) => {
      const now = performance.now();
      if (now - lastSpawn < minGap) return;
      lastSpawn = now;
      spawnSparkle(clientX, clientY);
      if (Math.random() > 0.6) {
        spawnSparkle(clientX + (Math.random() - 0.5) * 10, clientY + (Math.random() - 0.5) * 10);
      }
    };

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  const sendMessageToAI = async (text, currentHistory) => {
    setIsTyping(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          history: currentHistory
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Terjadi kesalahan server.');
      }

      const botMessage = {
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
      if (!isChatOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      const errorMessage = {
        sender: 'bot',
        text: `⚠️ **Gagal memuat respon.**\n\n${error.message}\n\n*Silakan periksa apakah GROQ_API_KEY di file \`.env\` sudah terisi dengan benar.*`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      if (!isChatOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (text) => {
    const userMessage = {
      sender: 'user',
      text,
      timestamp: new Date().toISOString()
    };

    const historyForAPI = messages.slice(1);
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    sendMessageToAI(text, historyForAPI);
  };

  const handleQuickReply = (text) => {
    handleSendMessage(text);
  };

  const handleAskAIForProduct = (product) => {
    setIsChatOpen(true);
    const queryText = `Halo Yuni, saya ingin bertanya tentang opsi "${product.name}". Boleh tolong jelaskan detail harga dan ketentuannya?`;
    handleSendMessage(queryText);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('kediri_chat_history');
    const welcomeMsg = {
      sender: 'bot',
      text: 'Halo saya Yuni! Selamat datang di **Sketsa Wajah Kediri**. 🎨 Ada yang bisa saya bantu hari ini?',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMsg]);
    setUnreadCount(0);
  };

  const toggleFaq = (index) => {
    setFaqOpenIndex(faqOpenIndex === index ? -1 : index);
  };

  const galleryItems = [
    { tag: 'Potret Solo', price: '+Rp0', url: 'https://res.cloudinary.com/dpdzxeukl/image/upload/v1783505180/ilustrasi/x8kw4rvertca9irt0trd.jpg' },
    { tag: 'Pasangan', price: '+Rp5.000', url: 'https://res.cloudinary.com/dpdzxeukl/image/upload/v1783507109/ilustrasi/p1ztzzon8qbgpjhtjjsx.png' },
    { tag: 'Background', price: '+Rp10.000', url: 'https://res.cloudinary.com/dpdzxeukl/image/upload/v1783506784/ilustrasi/hpi25zr8d9jp5qjftfeo.png' }
  ];

  return (
    <div className="app-layout">
      <div className="glitter-layer" id="glitterLayer" aria-hidden="true"></div>

      <header>
        <nav>
          <a href="#" className="logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 22 L20 6 L24 10 L8 26 L4 26 Z" stroke="#121212" strokeWidth="1.4" fill="none" />
              <path d="M17 9 L21 13" stroke="#5B5B5B" strokeWidth="1.4" />
            </svg>
            Sketsa Wajah <em>Kediri</em>
          </a>
          <ul className="nav-links">
            <li><a href="#layanan">Layanan</a></li>
            <li><a href="#cara-kerja">Cara Kerja</a></li>
            <li><a href="#galeri">Galeri</a></li>
            <li><a href="#testimoni">Testimoni</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
          <div className="nav-cta">
            <button className="btn btn-primary" onClick={() => setIsChatOpen(true)}>
              <MessageSquare size={16} />
              <span>Chat Customer Service</span>
            </button>
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <span className="eyebrow">Sketsa wajah asli lukis tangan</span>
            <h1>
              Setiap wajah punya cerita.<br />Kami <span className="script">menggoreskannya</span> jadi karya.
            </h1>
            <p className="lead">
              Jasa sketsa wajah custom dari foto — digambar langsung oleh seniman kami di atas kertas, lalu dipindai jadi file digital berkualitas tinggi. Cocok untuk kado, kenang-kenangan, atau hadiah untuk orang tersayang.
            </p>
            <div className="hero-cta">
              <a href="#layanan" className="btn btn-primary">Lihat Paket &amp; Harga</a>
              <a href="#galeri" className="btn btn-ghost">Lihat Galeri Karya</a>
            </div>
            <div className="hero-stats">
              <div><strong>200+</strong><span>Sketsa selesai</span></div>
              <div><strong>4,9/5</strong><span>Rating pelanggan</span></div>
              <div><strong>2–5 hari</strong><span>Waktu pengerjaan</span></div>
            </div>
          </div>

          <div>
            <div
              className="compare"
              id="compare"
              ref={sliderContainerRef}
            >
              <div className="compare-layer layer-photo">
                <svg viewBox="0 0 400 500" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
                  <rect width="400" height="500" fill="#FFFFFF" />
                  <g stroke="#C9C9C6" strokeWidth="1" fill="none">
                    <line x1="0" y1="60" x2="400" y2="60" /><line x1="0" y1="130" x2="400" y2="130" />
                    <line x1="0" y1="200" x2="400" y2="200" /><line x1="0" y1="270" x2="400" y2="270" />
                    <line x1="0" y1="340" x2="400" y2="340" /><line x1="0" y1="410" x2="400" y2="410" />
                    <line x1="100" y1="0" x2="100" y2="500" /><line x1="200" y1="0" x2="200" y2="500" /><line x1="300" y1="0" x2="300" y2="500" />
                  </g>
                  <g stroke="#9C9C98" strokeWidth="1.6" fill="none" strokeDasharray="4 5">
                    <ellipse cx="200" cy="220" rx="92" ry="122" />
                    <line x1="108" y1="220" x2="292" y2="220" />
                    <line x1="200" y1="98" x2="200" y2="342" />
                  </g>
                  <g stroke="#5B5B5B" strokeWidth="1.3" fill="none" strokeLinecap="round">
                    <path d="M132 118 Q120 250 148 335" />
                    <path d="M268 118 Q280 250 252 335" />
                    <path d="M132 128 Q140 92 200 88 Q260 92 268 128" />
                  </g>
                </svg>
              </div>

              <div
                className="compare-layer layer-sketch"
                id="sketchLayer"
                style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
              >
                <img
                  className="grayscale-img"
                  src="https://res.cloudinary.com/dpdzxeukl/image/upload/v1783505209/ilustrasi/mghtr4xhtdlyfq0w9r6c.jpg"
                  alt="Contoh hasil sketsa wajah karya Sketsa Wajah Kediri"
                />
              </div>

              <span className="compare-tag tag-foto">Sketsa Kasar</span>
              <span className="compare-tag tag-sketsa">Hasil Akhir</span>

              <div
                className="handle"
                id="handle"
                style={{ left: `${sliderPos}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
              >
                <div className="handle-grip">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="compare-hint">← geser tuas untuk lihat proses dari sketsa kasar ke hasil akhir →</p>
          </div>
        </div>
      </section>

      <Catalog onAskAI={handleAskAIForProduct} />

      <section id="cara-kerja">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Alur pemesanan</span>
            <h2>Empat langkah dari foto ke goresan pensil</h2>
            <p>Prosesnya sederhana dan bisa dipantau — kamu akan menerima pratinjau sebelum hasil akhir dikirim.</p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">01</div>
              <h3>Kirim Referensi Foto</h3>
              <p>Unggah foto wajah dengan pencahayaan jelas melalui formulir pemesanan atau WhatsApp.</p>
              <div className="step-line"></div>
            </div>
            <div className="step">
              <div className="step-num">02</div>
              <h3>Pilih Gaya &amp; Ukuran</h3>
              <p>Tentukan gaya sketsa (realis, semi-realis, atau garis minimal) serta ukuran kertas.</p>
              <div className="step-line"></div>
            </div>
            <div className="step">
              <div className="step-num">03</div>
              <h3>Seniman Mulai Menggambar</h3>
              <p>Sketsa digambar tangan di atas kertas, dengan pratinjau progres dikirim untuk persetujuanmu.</p>
              <div className="step-line"></div>
            </div>
            <div className="step">
              <div className="step-num">04</div>
              <h3>Terima Hasil Lukis Wajah</h3>
              <p>Hasil sketsa wajah di kertas gambar akan dikemas rapi lalu dikirim ke alamatmu.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="galeri" className="alt">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Galeri karya</span>
            <h2>Beberapa goresan dari sketsa kami</h2>
            <p>Contoh hasil sketsa dari berbagai kategori. Harga di bawah adalah <strong>biaya tambahan</strong> di luar harga dasar pada pricelist, tergantung jumlah wajah dan kompleksitas komposisi.</p>
          </div>
          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <div className="gallery-item" key={index}>
                <div className="gallery-frame">
                  <img className="grayscale-img" src={item.url} alt={`Karya Sketsa Wajah Kediri - ${item.tag}`} />
                </div>
                <div className="gallery-meta">
                  <span className="tag">{item.tag}</span>
                  <span className="price">{item.price}</span>
                </div>
                <button
                  className="btn-ask-gallery"
                  onClick={() => handleAskAIForProduct({ name: item.tag })}
                >
                  Tanyakan via chat
                </button>
              </div>
            ))}
          </div>
          <p className="gallery-note">Biaya tambahan digabung dengan harga dasar sesuai ukuran, warna, dan pigura pada pricelist di atas.</p>
        </div>
      </section>

      <section id="testimoni">
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">Kata mereka</span>
            <h2>Cerita dari pelanggan Sketsa Wajah Kediri</h2>
          </div>
          <div className="testi-grid">
            <div className="testi-card">
              <div className="testi-quote">&ldquo;</div>
              <p className="body">Detailnya luar biasa, sampai lesung pipi ayah saya kelihatan persis. Jadi kado ulang tahun pernikahan orang tua yang paling berkesan.</p>
              <div className="testi-person">
                <div className="testi-avatar">RA</div>
                <div><strong>Rani A.</strong><span>Sketsa Pasangan</span></div>
              </div>
            </div>
            <div className="testi-card">
              <div className="testi-quote">&ldquo;</div>
              <p className="body">Prosesnya jelas dari awal, ada update progres jadi tidak deg-degan. Hasil cetaknya juga rapi dan kertasnya tebal, langsung saya pigura.</p>
              <div className="testi-person">
                <div className="testi-avatar">DP</div>
                <div><strong>Dimas P.</strong><span>Sketsa Solo</span></div>
              </div>
            </div>
            <div className="testi-card">
              <div className="testi-quote">&ldquo;</div>
              <p className="body">Pesan sketsa keluarga isi 5 orang, komposisinya disusun ulang biar pas — hasilnya malah lebih bagus dari foto aslinya.</p>
              <div className="testi-person">
                <div className="testi-avatar">SN</div>
                <div><strong>Siti N.</strong><span>Sketsa Keluarga</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="alt">
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">Pertanyaan umum</span>
            <h2>Hal yang sering ditanyakan</h2>
          </div>
          <div className="faq-list">
            <div className={`faq-item ${faqOpenIndex === 0 ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => toggleFaq(0)}>
                Berapa lama waktu pengerjaan sketsa?
                <span className="plus">+</span>
              </button>
              <div className="faq-a" style={{ maxHeight: faqOpenIndex === 0 ? '200px' : '0px' }}>
                <p>Rata-rata 2–5 hari kerja untuk sketsa solo dan pasangan, serta 3–7 hari kerja untuk sketsa keluarga dengan lebih dari 3 wajah dan memakai background, terhitung sejak referensi foto dan detail pesanan dikonfirmasi.</p>
              </div>
            </div>

            <div className={`faq-item ${faqOpenIndex === 1 ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => toggleFaq(1)}>
                Foto seperti apa yang cocok dijadikan referensi?
                <span className="plus">+</span>
              </button>
              <div className="faq-a" style={{ maxHeight: faqOpenIndex === 1 ? '200px' : '0px' }}>
                <p>Gunakan foto dengan pencahayaan merata, wajah menghadap kamera atau sedikit menyamping, dan resolusi cukup tinggi agar detail seperti mata dan garis wajah terlihat jelas.</p>
              </div>
            </div>

            <div className={`faq-item ${faqOpenIndex === 2 ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => toggleFaq(2)}>
                Apakah saya bisa meminta revisi?
                <span className="plus">+</span>
              </button>
              <div className="faq-a" style={{ maxHeight: faqOpenIndex === 2 ? '200px' : '0px' }}>
                <p>Setiap paket sudah termasuk satu kali revisi minor, misalnya penyesuaian ekspresi atau bagian kecil komposisi, sebelum file final dikirim.</p>
              </div>
            </div>

            <div className={`faq-item ${faqOpenIndex === 3 ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => toggleFaq(3)}>
                Apa yang akan saya terima?
                <span className="plus">+</span>
              </button>
              <div className="faq-a" style={{ maxHeight: faqOpenIndex === 3 ? '200px' : '0px' }}>
                <p>Kamu akan menerima hasil lukis sketsa wajah dalam kertas gambar 250gsm atau dengan pigura.</p>
              </div>
            </div>

            <div className={`faq-item ${faqOpenIndex === 4 ? 'open' : ''}`}>
              <button className="faq-q" onClick={() => toggleFaq(4)}>
                Apakah bisa dikirim ke alamat saya?
                <span className="plus">+</span>
              </button>
              <div className="faq-a" style={{ maxHeight: faqOpenIndex === 4 ? '200px' : '0px' }}>
                <p>Tersedia opsi pengiriman, dikemas dengan pelindung dan dikirim ke seluruh Indonesia.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band" id="pesan">
        <div className="wrap">
          <h2>Siap mengabadikan wajah kesayanganmu?</h2>
          <p>Kirim foto referensimu sekarang, seniman kami akan membalas dalam 1x24 jam.</p>
          <a
            href="https://wa.me/6281946174344?text=Halo%20Admin%20Sketsa%20Wajah%20Kediri,%20saya%20tertarik%20untuk%20memesan%20sketsa%20wajah"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Mulai Pesan via WhatsApp
          </a>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <a href="#" className="logo" style={{ marginBottom: '14px' }}>
                <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                  <path d="M4 22 L20 6 L24 10 L8 26 L4 26 Z" stroke="#121212" strokeWidth="1.4" fill="none" />
                  <path d="M17 9 L21 13" stroke="#5B5B5B" strokeWidth="1.4" />
                </svg>
                Sketsa Wajah <em>Kediri</em>
              </a>
              <p style={{ fontSize: '.88rem', color: 'var(--graphite)', maxWidth: '32ch', lineHeight: '1.6' }}>
                Jasa Sketsa wajah custom — mengubah foto jadi karya tangan yang bisa disimpan seumur hidup.
              </p>
            </div>
            <div>
              <h4>Navigasi</h4>
              <ul>
                <li><a href="#layanan">Layanan</a></li>
                <li><a href="#cara-kerja">Cara Kerja</a></li>
                <li><a href="#galeri">Galeri</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4>Layanan</h4>
              <ul>
                <li><a href="#layanan">Sketsa Solo</a></li>
                <li><a href="#layanan">Sketsa Pasangan</a></li>
                <li><a href="#layanan">Sketsa Keluarga</a></li>
                <li><a href="#layanan">Sketsa Hewan Peliharaan</a></li>
              </ul>
            </div>
            <div>
              <h4>Kontak</h4>
              <ul>
                <li><a href="https://wa.me/6281946174344">WhatsApp: 0819-4617-4344</a></li>
                <li><a href="https://www.instagram.com/sketsa.kediri/">Instagram @sketsa.kediri</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Sketsa Wajah Kediri. Semua karya dilukis tangan.</span>
            <span>Dibuat dengan pensil, kertas, dan kesabaran.</span>
          </div>
        </div>
      </footer>

      <ChatWidget
        isOpen={isChatOpen}
        onClick={() => setIsChatOpen(!isChatOpen)}
        unreadCount={unreadCount}
      />

      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        onQuickReply={handleQuickReply}
      />
    </div>
  );
};

export default App;
