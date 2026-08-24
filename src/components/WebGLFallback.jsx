import React from 'react';
import giftConfig from '../config/giftConfig';

export default function WebGLFallback() {
  return (
    <div className="fallback-container">
      <div className="fallback-card">
        <h1>{giftConfig.title}</h1>
        <p>Dear {giftConfig.receiverName}, even without 3D graphics support on this browser, my love for you remains true!</p>
        <div className="fallback-memories">
          {giftConfig.memories.map((m) => (
            <div key={m.id} className="fallback-item">
              <h3>{m.title}</h3>
              <p>{m.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}