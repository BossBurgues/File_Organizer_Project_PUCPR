import React from 'react';

export default function Header({ 
  currentPath, onGoUp, onRefresh, onSwitchView, onFindDuplicates, 
  onOpenOrganizeModal, onDeleteSelected, selectedCount, 
  onUndo, canUndo, onOpenHelp
}) {
  const hasSelection = selectedCount > 0;
  const isRoot = currentPath.length <= 3 && (currentPath.endsWith(':\\') || currentPath === '/');

  return (
    <header className="app-header">
      <h1>🖥️ File Organizer</h1>
      <div className="header-actions">
        <button onClick={onGoUp} disabled={isRoot} title="Ir para o diretório pai">⬅️ Voltar</button>
        <button onClick={() => onSwitchView('explorer')} title="Ver o explorador de arquivos">📁 Explorador</button>
        <button onClick={onFindDuplicates} title="Encontrar duplicatas na pasta atual">🔍 Encontrar Duplicatas</button>
        <button className="organize-btn" onClick={onOpenOrganizeModal}>🧹 Organizar</button>
        <button onClick={onUndo} disabled={!canUndo} title="Desfazer a última organização">↩️ Desfazer</button>
        {hasSelection && (
          <button className="delete-btn" onClick={onDeleteSelected}>❌ Deletar ({selectedCount})</button>
        )}
        <button onClick={onOpenHelp} style={{borderColor: '#33aaff', color: '#33aaff'}}>❓ Ajuda</button>
      </div>
    </header>
  );
}