🖥️ File Organizer v3.0
File Organizer is a full-stack web application built to manage and organize local files efficiently and intuitively. The interface is built with React and the backend with FastAPI (Python), running on a local server.

✨ Features
File Navigation: Explore your file system with a directory tree, a detailed file table, and a button to go to the parent directory.

Smart Organization: Organize entire folders with one click, using predefined strategies:

By Type: Moves files into folders like Images, Documents, Videos, etc.

By Date: Groups files into folders by modification Year/Month.

File Actions:

Safe Recycle Bin: File deletion is safe, moving them to an internal recycle bin (backend/.recycle_bin) instead of deleting them permanently.

Undo Last Organization: The last organization operation can be reverted with a single click.

Multiple Selection: Delete multiple files at once.

Advanced Tools:

Duplicate Finder: Scans a folder and its subfolders to find files with identical content.

Rich Interface:

Details panel with complete file information (size, dates, MD5 hash).

Context menu (right-click) for quick actions.

"Toast" notifications for action feedback.

Integrated Help menu.

🛠️ Tech Stack
Frontend: React, Vite, react-toastify

Backend: Python, FastAPI, Uvicorn

🚀 How to Run
Prerequisites
Node.js (version 18+)

Python (version 3.9+)

1. Installation (First time only)
Backend:

Bash

cd backend
python -m venv venv
.\venv\Scripts\activate.bat
pip install -r requirements.txt
Frontend:

Bash

cd frontend
npm install
2. Execution
For a complete experience and to avoid permission issues with the Windows file system, use the startup script as an administrator.

Navigate to the project's root folder.

Right-click on the run_as_admin.bat file.

Select "Run as administrator".

Wait for the two servers to start and for the browser to automatically open the application page.
