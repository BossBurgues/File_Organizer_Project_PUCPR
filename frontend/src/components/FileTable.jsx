import React from 'react';

export default function FileTable({ files, selectedFiles, onFileSelect, onSelectAll, onFileClick, onContextMenu, onDirectoryDoubleClick }) {
  const formatSize = (size) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 ** 2) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(2)} MB`;
    return `${(size / 1024 ** 3).toFixed(2)} GB`;
  };

  if (!Array.isArray(files)) {
    return <p>Carregando ou ocorreu um erro...</p>;
  }

  return (
    <div className="file-table-container">
      <table className="file-table">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={onSelectAll} checked={files.length > 0 && selectedFiles.length === files.length} /></th>
            <th>Nome</th>
            <th>Tamanho</th>
            <th>Data Modificação</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr 
              key={file.path} 
              className={selectedFiles.includes(file.path) ? 'selected-row' : ''}
              onClick={() => onFileClick(file)}
              onDoubleClick={() => file.is_dir && onDirectoryDoubleClick(file.path)}
              onContextMenu={(e) => onContextMenu(e, file)}
              title={file.is_dir ? "Duplo-clique para entrar na pasta" : file.name}
            >
              <td><input type="checkbox" checked={selectedFiles.includes(file.path)} onChange={() => onFileSelect(file.path)} /></td>
              <td>{file.is_dir ? '📁' : '📄'} {file.name}</td>
              <td>{file.is_dir ? '--' : formatSize(file.size)}</td>
              <td>{file.modified}</td>
              <td>{file.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {files.length === 0 && <p className="empty-folder-message">Esta pasta está vazia.</p>}
    </div>
  );
}