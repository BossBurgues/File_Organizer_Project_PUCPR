import React from 'react';
import './OrganizeModal.css';

export default function OrganizeModal({ isOpen, onClose, onOrganize }) {
  if (!isOpen) {
    return null;
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Escolha uma Estratégia de Organização</h2>
        <div className="modal-actions">
          <button onClick={() => onOrganize('by_type')}>🗂️ Por Tipo de Arquivo</button>
          <button onClick={() => onOrganize('by_date')}>📅 Por Data (Ano/Mês)</button>
        </div>
        <button className="modal-close" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}