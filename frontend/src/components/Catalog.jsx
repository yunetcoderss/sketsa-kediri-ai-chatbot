import React from 'react';
import { pricelist } from '../data/products';
import { HelpCircle } from 'lucide-react';

const Catalog = ({ onAskAI }) => {
  const handleAskAboutPricelist = () => {
    onAskAI({ name: "Daftar Harga Lengkap" });
  };

  return (
    <section id="layanan" className="alt">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Daftar harga</span>
          <h2>Pricelist sketsa wajah</h2>
          <p>Harga sudah termasuk 1x revisi minor. Pilih ukuran kertas, hitam putih atau warna, serta dengan/tanpa pigura.</p>
        </div>

        <div className="pricelist-grid">
          <div className="price-panel">
            <h3>Tanpa Pigura</h3>
            <ul className="price-list">
              {pricelist.tanpaPigura.map((item, idx) => (
                <li className="price-row" key={idx}>
                  <span className="name">{item.name}</span>
                  <span className="dots"></span>
                  <span className="amount">{item.amount}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="price-panel">
            <h3>Dengan Pigura</h3>
            <ul className="price-list">
              {pricelist.denganPigura.map((item, idx) => (
                <li className="price-row" key={idx}>
                  <span className="name">{item.name}</span>
                  <span className="dots"></span>
                  <span className="amount">{item.amount}</span>
                </li>
              ))}
            </ul>
            <p className="price-note">*Pigura tersedia untuk ukuran A4 dan A5.</p>
          </div>
        </div>

        <div className="pricelist-footer">
          <button 
            className="btn btn-primary"
            onClick={handleAskAboutPricelist}
            style={{ marginTop: '30px' }}
          >
            <HelpCircle size={16} />
            <span>Tanyakan Via Chat</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Catalog;
