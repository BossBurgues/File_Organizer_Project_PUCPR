File Organizer v3.0

File Organizer is a full-stack web application built to manage and organize local files efficiently and intuitively. The interface is built with React and the backend with FastAPI (Python), running on a local server.

File Organizer is a full-stack web application built to efficiently and intuitively manage and organize local files.  
The interface is built with React, and the backend is powered by FastAPI (Python), running on a local server.

##  Features

* **File Navigation:** Explore your file system with a directory tree, detailed file table, and a button to go back to the parent directory.
* **Smart Organization:** Organize entire folders with one click using predefined strategies:
    * **By Type:** Moves files into folders such as `Images`, `Documents`, `Videos`, etc.
    * **By Date:** Groups files into folders by `Year/Month` of modification.
* **File Actions:**
    * **Safe Recycle Bin:** File deletion is secure — instead of permanent deletion, files are moved to an internal recycle bin (`backend/.recycle_bin`).
    * **Undo Last Organization:** The last organization operation can be reverted with a single click.
    * **Multi-Select:** Delete multiple files at once.
* **Advanced Tools:**
    * **Duplicate Finder:** Scans a folder and its subfolders to find files with identical content.
* **Rich Interface:**
    * Details panel with complete file information (size, dates, MD5 hash).
    * Context menu (right-click) for quick actions.
    * "Toast" notifications for action feedback.
    * Integrated Help Menu.

By Date: Groups files into folders by modification Year/Month.

File Actions:

##  How to Run

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18+)
* [Python](https://www.python.org/) (version 3.9+)

### 1. Installation (First time only)
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

### 2. Execution
For the best experience and to avoid permission issues with the Windows file system, run the startup script as an administrator.

1.  Navigate to the project’s root folder.  
2.  Right-click the `run_as_admin.bat` file.  
3.  Select **“Run as administrator.”**  
4.  Wait for both servers to start, and the browser will automatically open the application page.
