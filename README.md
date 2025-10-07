#  File Organizer v3.0

File Organizer é uma aplicação web full-stack construída para gerenciar e organizar arquivos locais de forma eficiente e intuitiva. A interface é construída com React e o backend com FastAPI (Python), rodando em um servidor local.

##  Funcionalidades

* **Navegação de Arquivos:** Explore seu sistema de arquivos com uma árvore de diretórios, tabela de arquivos detalhada e botão para voltar ao diretório pai.
* **Organização Inteligente:** Organize pastas inteiras com um clique, usando estratégias pré-definidas:
    * **Por Tipo:** Move arquivos para pastas como `Imagens`, `Documentos`, `Vídeos`, etc.
    * **Por Data:** Agrupa arquivos em pastas por `Ano/Mês` de modificação.
* **Ações de Arquivo:**
    * **Lixeira Segura:** A deleção de arquivos é segura, movendo-os para uma lixeira interna (`backend/.recycle_bin`) em vez de apagar permanentemente.
    * **Desfazer Última Organização:** A última operação de organização pode ser revertida com um único clique.
    * **Seleção Múltipla:** Delete múltiplos arquivos de uma vez.
* **Ferramentas Avançadas:**
    * **Localizador de Duplicatas:** Escaneia uma pasta e suas subpastas para encontrar arquivos com conteúdo idêntico.
* **Interface Rica:**
    * Painel de detalhes com informações completas do arquivo (tamanho, datas, hash MD5).
    * Menu de contexto (botão direito) para ações rápidas.
    * Notificações "Toast" para feedback de ações.
    * Menu de Ajuda integrado.

##  Tech Stack

* **Frontend:** React, Vite, `react-toastify`
* **Backend:** Python, FastAPI, Uvicorn

##  Como Executar

### Pré-requisitos
* [Node.js](https://nodejs.org/) (versão 18+)
* [Python](https://www.python.org/) (versão 3.9+)

### 1. Instalação (Apenas na primeira vez)
* **Backend:**
    ```bash
    cd backend
    python -m venv venv
    .\venv\Scripts\activate.bat
    pip install -r requirements.txt
    ```
* **Frontend:**
    ```bash
    cd frontend
    npm install
    ```

### 2. Execução
Para uma experiência completa e para evitar problemas de permissão com o sistema de arquivos do Windows, use o script de inicialização como administrador.

1.  Navegue até a pasta raiz do projeto.
2.  Clique com o botão direito no arquivo `run_as_admin.bat`.
3.  Selecione **"Executar como administrador"**.
4.  Aguarde os dois servidores iniciarem e o navegador abrir automaticamente na página da aplicação.