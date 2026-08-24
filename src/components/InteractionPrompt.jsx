import React from 'react';

export default function InteractionPrompt({ title, subtitle, buttonText, onClick }) {
  return (
    <div className="room-card-overlay">
      <div className="room-card">
        <h3 className="room-card-title">{title || "Room Notice"}</h3>
        <p className="room-card-subtitle">{subtitle || "A cozy space awaits..."}</p>
        <button className="room-card-btn" onClick={onClick}>
          {buttonText || "Enter"}
        </button>
      </div>
    </div>
  );
}