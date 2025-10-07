import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Filters from './components/Filters';
import FileTable from './components/FileTable';
import DirectoryTree from './components/DirectoryTree';
import OrganizeModal from './components/OrganizeModal';
import DetailsPanel from './components/DetailsPanel';
import DuplicatesView from './components/DuplicatesView';
import StatusBar from './components/StatusBar';
import ContextMenu from './components/ContextMenu';
import HelpModal from './components/HelpModal';
import './index.css';

function App() {
  const [view, setView] = useState('explorer');
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('C:\\Users');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [detailedFile, setDetailedFile] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [pathInput, setPathInput] = useState('C:\\Users');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Pronto.');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, file: null });

  const fetchFiles = useCallback(async (path) => {
    if (!path) return;
    setIsLoading(true);
    setStatusMessage(`Carregando ${path}...`);
    setFiles([]);
    try {
      const res = await fetch(`http://127.0.0.1:8000/list-files?path=${encodeURIComponent(path)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Erro HTTP: ${res.status}`);
      }
      const data = await res.json();
      const filesArray = Array.isArray(data) ? data : [];
      setFiles(filesArray);
      setStatusMessage(`${filesArray.length} itens carregados.`);
    } catch (err) {
      toast.error(`Erro: ${err.message}`);
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'explorer') {
      setPathInput(currentPath);
      fetchFiles(currentPath);
      setSelectedFiles([]);
      setDetailedFile(null);
    }
  }, [currentPath, view, fetchFiles]);

  const handleFileClick = async (file) => {
    if (file.is_dir) {
      setDetailedFile(null);
    } else {
      try {
        const res = await fetch(`http://127.0.0.1:8000/file-details?path=${encodeURIComponent(file.path)}`);
        const data = await res.json();
        setDetailedFile(data);
      } catch (err) {
        toast.error("Não foi possível buscar os detalhes do arquivo.");
      }
    }
  };

  const handleFindDuplicates = async () => {
    setIsLoading(true);
    setStatusMessage(`Procurando duplicatas em ${currentPath}... Isso pode levar tempo.`);
    setView('duplicates');
    try {
      const res = await fetch(`http://127.0.0.1:8000/find-duplicates?path=${encodeURIComponent(currentPath)}`);
      const data = await res.json();
      setDuplicates(data.duplicates);
      setStatusMessage(`${data.duplicates.length} grupos de arquivos duplicados encontrados.`);
    } catch (err) {
       toast.error("Erro ao procurar por duplicatas.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContextMenu = (e, file) => { e.preventDefault(); setContextMenu({ visible: true, x: e.clientX, y: e.clientY, file }); };
  const closeContextMenu = () => setContextMenu({ visible: false, x: 0, y: 0, file: null });

  const handleDelete = async (paths) => {
    if (!paths || paths.length === 0) return;
    if (!window.confirm(`Mover ${paths.length} item(ns) para a lixeira?`)) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/delete-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(`${result.deleted_count} item(ns) movido(s) para a lixeira.`);
        fetchFiles(currentPath);
      } else { throw new Error(result.detail || "Erro no servidor ao deletar."); }
    } catch (err) { toast.error(`Erro ao mover para lixeira: ${err.message}`); }
  };

  const handleOrganize = async (strategy) => {
    setIsModalOpen(false);
    if (!currentPath || !strategy) return;
    if (!window.confirm(`Organizar "${currentPath}" usando a estratégia "${strategy}"?`)) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/organize-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentPath, strategy: strategy }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success(`Organização concluída! ${result.files_moved} arquivos movidos.`);
        setCanUndo(true);
        fetchFiles(currentPath);
      } else { throw new Error(result.detail || 'Ocorreu um erro na organização.'); }
    } catch (err) { toast.error(`Erro: ${err.message}`); }
  };

  const handleUndo = async () => {
    if (!window.confirm("Tem certeza que deseja desfazer a última organização?")) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/undo-last-organization', { method: 'POST' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail);
      }
      toast.success("Ação desfeita com sucesso!");
      setCanUndo(false);
      fetchFiles(currentPath);
    } catch (err) {
      toast.error(`Erro ao desfazer: ${err.message}`);
    }
  };
  
  const handleFileSelect = (filePath) => {
    setSelectedFiles(prev => prev.includes(filePath) ? prev.filter(p => p !== filePath) : [...prev, filePath]);
  };
  
  const handleSelectAll = (event) => {
    setSelectedFiles(event.target.checked ? files.map(f => f.path) : []);
  };

  const handlePathSubmit = () => setCurrentPath(pathInput);

  const handleGoUp = () => {
    const lastSlashIndex = Math.max(currentPath.lastIndexOf('\\'), currentPath.lastIndexOf('/'));
    if (currentPath.length <= 3) return;
    let parentPath = currentPath.substring(0, lastSlashIndex);
    if (parentPath.endsWith(':')) parentPath += '\\';
    if (!parentPath) return;
    setCurrentPath(parentPath);
  };

  return (
    <div className="app" onClick={closeContextMenu}>
      <ToastContainer theme="dark" position="bottom-right" />
      <Header
        currentPath={currentPath} onGoUp={handleGoUp} onRefresh={() => fetchFiles(currentPath)}
        onSwitchView={setView} onFindDuplicates={handleFindDuplicates}
        onOpenOrganizeModal={() => setIsModalOpen(true)}
        onDeleteSelected={() => handleDelete(selectedFiles)} selectedCount={selectedFiles.length}
        onUndo={handleUndo} canUndo={canUndo} onOpenHelp={() => setIsHelpOpen(true)}
      />
      <OrganizeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onOrganize={handleOrganize}/>
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <div className="main-content">
        {view === 'explorer' && (
          <>
            <div className="left-panel">
              <DirectoryTree path={currentPath} onDirectorySelect={setCurrentPath} />
            </div>
            <div className="right-panel">
              <Filters onPathChange={setPathInput} onPathSubmit={handlePathSubmit} currentPath={pathInput} />
              <FileTable 
                files={files} 
                selectedFiles={selectedFiles} 
                onFileSelect={handleFileSelect} 
                onSelectAll={handleSelectAll} 
                onFileClick={handleFileClick} 
                onContextMenu={handleContextMenu}
                onDirectoryDoubleClick={setCurrentPath}
              />
            </div>
            {detailedFile && <DetailsPanel file={detailedFile} onClose={() => setDetailedFile(null)} />}
          </>
        )}
        {view === 'duplicates' && <DuplicatesView duplicates={duplicates} onDelete={handleDelete} isLoading={isLoading} />}
      </div>
      <StatusBar message={statusMessage} />
      {contextMenu.visible && <ContextMenu {...contextMenu} onDelete={handleDelete} />}
    </div>
  );
}

export default App;