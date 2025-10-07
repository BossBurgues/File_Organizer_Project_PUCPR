import React from 'react';

export default function ContextMenu({ x, y, file, onDelete }) {
  const style = { top: y, left: x, position: 'fixed' };
  
  return (
    <ul className="context-menu" style={style}>
      <li onClick={() => onDelete([file.path])}>Deletar</li>
      <li>Renomear (em breve)</li>
    </ul>
  );
}