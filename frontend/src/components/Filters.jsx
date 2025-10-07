import React from 'react';

export default function Filters({ currentPath, onPathChange, onPathSubmit }) {
  return (
    <form className="filters" onSubmit={(e) => { e.preventDefault(); onPathSubmit(); }}>
      <input
        type="text"
        placeholder="Caminho da pasta"
        value={currentPath}
        onChange={(e) => onPathChange(e.target.value)}
      />
      <button type="submit">Ir</button>
    </form>
  );
}