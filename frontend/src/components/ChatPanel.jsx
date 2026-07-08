import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { products } from '../data/products';

const ChatPanel = ({ isOpen, onClose, messages, onSendMessage, isTyping, onQuickReply }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { label: '💰 Daftar Harga', text: 'Boleh minta rincian lengkap daftar harga sketsa wajah?' },
    { label: '🎁 Rekomendasi Kado', text: 'Saya mau beli untuk kado wisuda pacar, rekomendasi gaya sketsa apa ya?' },
    { label: '📸 Cara Kirim Foto', text: 'Bagaimana kriteria foto wajah yang bagus untuk digambar?' },
    { label: '⏳ Lama Pengerjaan', text: 'Berapa hari proses pembuatan sketsanya selesai?' },
    { label: '💳 Cara Pesan & Bayar', text: 'Bagaimana alur pemesanan dan metode pembayarannya?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const getMentionedProducts = (text) => {
    if (!text) return [];
    return products.filter(product => {
      const regex = new RegExp(product.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
      return regex.test(text);
    });
  };

  return (
    <div className={`chat-panel ${isOpen ? 'active' : ''}`}>
      <div className="chat-header">
        <div className="chat-bot-info">
          <div className="chat-avatar-container">
            <span className="chat-avatar-emoji">👨‍🎨</span>
            <span className="online-badge"></span>
          </div>
          <div>
            <h4 className="chat-bot-name">Customer Service</h4>
            <p className="chat-bot-status">Online • Siap membantu</p>
          </div>
        </div>
        <button className="btn-close-chat" onClick={onClose} aria-label="Tutup Chat">
          <X size={20} />
        </button>
      </div>

      <div className="chat-messages-container">
        {messages.map((msg, index) => {
          const mentionedProducts = msg.sender === 'bot' ? getMentionedProducts(msg.text) : [];
          
          return (
            <div key={index} className={`chat-message-wrapper ${msg.sender}`}>
              <div className={`chat-message-bubble ${msg.sender}`}>
                <div className="message-text">
                  {msg.text.split('\n').map((paragraph, idx) => (
                    <p key={idx} style={{ margin: paragraph ? '0 0 8px 0' : '0' }}>
                      {paragraph.split('**').map((part, pIdx) => 
                        pIdx % 2 === 1 ? <strong key={pIdx}>{part}</strong> : part
                      )}
                    </p>
                  ))}
                </div>
                <span className="message-time">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>

              {mentionedProducts.length > 0 && (
                <div className="inline-products-container">
                  {mentionedProducts.map(product => (
                    <div key={product.id} className="inline-product-card">
                      <img src={product.image} alt={product.name} className="inline-prod-img" />
                      <div className="inline-prod-info">
                        <h5>{product.name}</h5>
                        <p className="inline-prod-desc">{product.description.slice(0, 75)}...</p>
                        <div className="inline-prod-footer">
                          <span className="inline-prod-price">Mulai {Object.values(product.price)[0]}</span>
                          <a 
                            href={`https://wa.me/6281946174344?text=Halo%20Admin%20Sketsa%20Wajah%20Studio,%20saya%20tertarik%20untuk%20memesan%20${encodeURIComponent(product.name)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn-order-now"
                          >
                            <ShoppingBag size={14} />
                            <span>Pesan via WA</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="chat-message-wrapper bot">
            <div className="chat-message-bubble bot typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-quick-replies">
        <div className="quick-replies-scroll">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              className="quick-reply-btn"
              onClick={() => onQuickReply(reply.text)}
            >
              {reply.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Tanyakan sesuatu ke Seno..."
          className="chat-input-field"
          disabled={isTyping}
        />
        <button 
          type="submit" 
          className="btn-send-message" 
          disabled={!inputValue.trim() || isTyping}
          aria-label="Kirim Pesan"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
