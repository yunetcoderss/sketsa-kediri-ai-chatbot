import React from 'react';
import { MessageCircle, Sparkles, X } from 'lucide-react';

const ChatWidget = ({ isOpen, onClick, unreadCount }) => {
  return (
    <div className={`chat-widget-container ${isOpen ? 'chat-open' : ''}`}>
      {!isOpen && unreadCount > 0 && (
        <div className="chat-badge animate-bounce">
          {unreadCount}
        </div>
      )}
      
      <button 
        className={`chat-widget-button ${isOpen ? 'active' : ''}`}
        onClick={onClick}
        aria-label={isOpen ? "Tutup obrolan" : "Tanyakan via chat"}
      >
        {isOpen ? (
          <X size={26} className="widget-icon-close" />
        ) : (
          <div className="widget-icons">
            <MessageCircle size={26} className="widget-icon-msg" />
            <Sparkles size={14} className="widget-icon-sparkle" />
          </div>
        )}
      </button>

      {!isOpen && (
        <div className="chat-tooltip">
          <div className="tooltip-content">
            <span className="tooltip-emoji">🎨</span>
            <span>Tanyakan via chat</span>
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
