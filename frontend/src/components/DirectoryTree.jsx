import React, { useState, useEffect } from 'react';

export default function DirectoryTree({ path, onDirectorySelect }) {
  const [tree, setTree] = useState([]);

  useEffect(() => {
    const fetchTree = async (dir) => {
      if (!dir) return;
      try {
        const res = await fetch(`http://127.0.0.1:8000/list-files?path=${encodeURIComponent(dir)}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setTree(data.filter(item => item.is_dir));
        } else {
          setTree([]);
        }
      } catch (err) {
        console.error("Erro ao buscar árvore de diretórios:", err);
      }
    };
    fetchTree(path);
  }, [path]);

  return (
    <div>
      <h3>Navegador</h3>
      <ul className="directory-tree">
        {tree.map(item => (
          <li key={item.path}>
            <span onClick={() => onDirectorySelect(item.path)}>
              📁 {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}