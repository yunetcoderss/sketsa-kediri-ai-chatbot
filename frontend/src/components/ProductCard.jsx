import React from 'react';
import { HelpCircle } from 'lucide-react';

const ProductCard = ({ product, onAskAI }) => {
  const renderIcon = () => {
    switch (product.id) {
      case 'sketsa-solo':
        return (
          <svg className="service-icon" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="20" r="12" stroke="#211D1A" stroke-width="1.6" />
            <path d="M8 46c2-11 9-17 18-17s16 6 18 17" stroke="#211D1A" stroke-width="1.6" />
          </svg>
        );
      case 'sketsa-pasangan':
        return (
          <svg className="service-icon" viewBox="0 0 52 52" fill="none">
            <circle cx="18" cy="19" r="10" stroke="#211D1A" stroke-width="1.6" />
            <circle cx="34" cy="19" r="10" stroke="#211D1A" stroke-width="1.6" />
            <path d="M4 46c2-10 8-15 14-15M48 46c-2-10-8-15-14-15" stroke="#211D1A" stroke-width="1.6" />
          </svg>
        );
      case 'sketsa-keluarga':
        return (
          <svg className="service-icon" viewBox="0 0 52 52" fill="none">
            <circle cx="14" cy="17" r="7" stroke="#211D1A" stroke-width="1.5" />
            <circle cx="38" cy="17" r="7" stroke="#211D1A" stroke-width="1.5" />
            <circle cx="26" cy="24" r="8" stroke="#211D1A" stroke-width="1.5" />
            <path d="M4 46c1-8 6-12 10-12M48 46c-1-8-6-12-10-12M14 46c1-9 6-13 12-13s11 4 12 13" stroke="#211D1A" stroke-width="1.5" />
          </svg>
        );
      case 'sketsa-hewan':
        return (
          <svg className="service-icon" viewBox="0 0 52 52" fill="none">
            <path d="M26 44c-9 0-16-6-16-14 0-6 5-10 8-14 1-2 3-2 4 0l4 6 4-6c1-2 3-2 4 0 3 4 8 8 8 14 0 8-7 14-16 14Z" stroke="#211D1A" stroke-width="1.6" />
          </svg>
        );
      default:
        return null;
    }
  };

  const prices = Object.entries(product.price);
  const firstPrice = prices[0] ? prices[0][1] : 'Rp0';
  const firstKey = prices[0] ? prices[0][0] : 'A4';

  return (
    <div className="service-card">
      <div className="service-top-content">
        {renderIcon()}
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <ul className="service-features">
          {product.features.map((feature, idx) => (
            <li key={idx}>
              <span className="service-features-dot"></span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="service-bottom">
        <div className="service-price">
          {firstPrice}
          <span>Mulai Dari · {firstKey}</span>
        </div>
        <button 
          className="btn-ask-service"
          onClick={() => onAskAI(product)}
        >
          <HelpCircle size={14} />
          <span>Tanya Detail via Chat</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
