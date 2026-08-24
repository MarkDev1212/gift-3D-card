import React from 'react';
import { X } from 'lucide-react';

export default function PhotoModal({ memory, onClose }) {
  if (!memory) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="photo-container">
          <img src={memory.image} alt={memory.title} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600"; }} />
        </div>
        <h3 className="memory-title">{memory.title}</h3>
        <p className="memory-message">{memory.message}</p>
      </div>
    </div>
  );
}