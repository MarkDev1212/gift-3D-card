import React, { useEffect } from 'react';

export default function PhotoModal({ memory, onClose }) {
  // Hooks must be called unconditionally
  useEffect(() => {
    if (!memory) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [memory, onClose]);

  if (!memory) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={memory.title}
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Photo */}
        <div className="photo-frame-wrap">
          <img
            src={memory.image}
            alt={memory.title}
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80';
            }}
          />
        </div>

        {/* Title & message */}
        <h3 className="memory-title">{memory.title}</h3>
        <p className="memory-message">"{memory.message}"</p>
      </div>
    </div>
  );
}
