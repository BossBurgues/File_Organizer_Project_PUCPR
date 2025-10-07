import React from 'react';

export default function DetailsPanel({ file, onClose }) {
  if (!file) return null;
  const formatSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 ** 2) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(2)} MB`;
    return `${(size / 1024 ** 3).toFixed(2)} GB`;
  };

  return (
    <div className="details-panel">
      <button className="close-btn" onClick={onClose}>×</button>
      <h3>Detalhes</h3>
      {file.error ? <p className="error-text">{file.error}</p> : (
        <ul>
          <li><strong>Nome:</strong> {file.path.split(/\\|\//).pop()}</li>
          <li><strong>Caminho:</strong> {file.path}</li>
          <li><strong>Tamanho:</strong> {formatSize(file.size)} ({file.size} bytes)</li>
          <li><strong>Criado:</strong> {file.created}</li>
          <li><strong>Modificado:</strong> {file.modified}</li>
          <li><strong>Acessado:</strong> {file.accessed}</li>
          <li><strong>MD5 Hash:</strong> <span style={{fontSize: '11px'}}>{file.hash}</span></li>
        </ul>
      )}
    </div>
  );
}