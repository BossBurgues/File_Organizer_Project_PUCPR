import React from 'react';
import './OrganizeModal.css'; // Reutiliza o estilo do modal

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Ajuda do File Organizer</h2>
        <div style={{ textAlign: 'left', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
          <h4>📁 Explorador</h4>
          <p>A tela principal. Navegue pelas pastas usando a árvore à esquerda, o campo de texto ou o botão "Voltar". Dê um duplo-clique em uma pasta na tabela para entrar nela.</p>
          <h4>🔍 Encontrar Duplicatas</h4>
          <p>Esta ferramenta varre a pasta atual em busca de arquivos com conteúdo idêntico e os agrupa para que você possa deletar as cópias.</p>
          <h4>🧹 Organizar</h4>
          <p>Abre um menu para escolher como organizar a pasta atual. As opções movem os arquivos para subpastas. A ação pode ser revertida com o botão "Desfazer".</p>
          <h4>❌ Deletar</h4>
          <p>Move os arquivos selecionados para uma lixeira interna do programa (na pasta `backend/.recycle_bin`), em vez de deletá-los permanentemente.</p>
          <h4>↩️ Desfazer</h4>
          <p>Reverte a última operação de "Organizar" que foi executada com sucesso. Esta opção só fica ativa após uma organização.</p>
        </div>
        <button className="modal-close" onClick={onClose} style={{marginTop: '20px'}}>
          Fechar
        </button>
      </div>
    </div>
  );
}