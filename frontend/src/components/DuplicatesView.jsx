import React, { useState } from 'react';

export default function DuplicatesView({ duplicates, onDelete, isLoading }) {
  const [selectedToDelete, setSelectedToDelete] = useState([]);

  const handleSelect = (filePath) => {
    setSelectedToDelete(prev => 
      prev.includes(filePath) 
        ? prev.filter(p => p !== filePath)
        : [...prev, filePath]
    );
  };

  if (isLoading) return <h2>Procurando arquivos duplicados...</h2>;
  if (!duplicates || duplicates.length === 0) return <h2>Nenhum arquivo duplicado encontrado.</h2>

  return (
    <div className="duplicates-view">
      <h2>Arquivos Duplicados Encontrados</h2>
      <button 
        className="delete-btn" 
        onClick={() => onDelete(selectedToDelete)}
        disabled={selectedToDelete.length === 0}
      >
        Deletar Selecionados ({selectedToDelete.length})
      </button>
      {duplicates.map((group, index) => (
        <div key={index} className="duplicate-group">
          <h4>Grupo {index + 1} ({group.length} cópias):</h4>
          <ul>
            {group.map(filePath => (
              <li key={filePath}>
                <label>
                  <input 
                    type="checkbox" 
                    checked={selectedToDelete.includes(filePath)}
                    onChange={() => handleSelect(filePath)} 
                  />
                  {filePath}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}