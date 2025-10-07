import os
import shutil
import hashlib
import subprocess
import re
from datetime import datetime
import locale
import json

try:
    locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')
except locale.Error:
    try:
        locale.setlocale(locale.LC_TIME, 'Portuguese_Brazil.1252')
    except locale.Error:
        print("Aviso: Locale 'pt_BR' não encontrado. Nomes dos meses podem aparecer em inglês.")

EXTENSION_MAP = {
    '.jpg': 'Imagens', '.jpeg': 'Imagens', '.png': 'Imagens', '.gif': 'Imagens', '.bmp': 'Imagens',
    '.pdf': 'Documentos', '.docx': 'Documentos', '.xlsx': 'Planilhas', '.pptx': 'Apresentacoes', '.txt': 'Textos',
    '.mp4': 'Videos', '.avi': 'Videos', '.mkv': 'Videos',
    '.mp3': 'Musicas', '.wav': 'Musicas',
    '.zip': 'Compactados', '.rar': 'Compactados', '.7z': 'Compactados',
    '.exe': 'Executaveis', '.msi': 'Instaladores',
}

# --- CAMINHOS PARA ARQUIVOS DE LOG E LIXEIRA ---
UNDO_LOG_FILE = os.path.join(os.path.dirname(__file__), '..', '.undo_log.json')
RECYCLE_BIN_PATH = os.path.join(os.path.dirname(__file__), '..', '.recycle_bin')

# Garante que a pasta da lixeira exista na inicialização
if not os.path.exists(RECYCLE_BIN_PATH):
    os.makedirs(RECYCLE_BIN_PATH)

def get_directory_contents(path: str):
    items = []
    dir_pattern = re.compile(r"(\d{2}/\d{2}/\d{4})\s+(\d{2}:\d{2})\s+(<DIR>|[\d\.,]+)\s+(.+)")
    try:
        process = subprocess.run(
            ['cmd', '/c', 'dir', '/-c', '/a', path], 
            capture_output=True, text=True, encoding='cp850', shell=True, check=True
        )
        for line in process.stdout.splitlines():
            match = dir_pattern.match(line)
            if match:
                date_str, time_str, size_or_dir, name = match.groups()
                if name.strip() in ['.', '..']: continue
                full_path = os.path.join(path, name)
                is_dir = (size_or_dir == '<DIR>')
                size = 0 if is_dir else int(size_or_dir.replace('.', '').replace(',', ''))
                mod_date = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%Y %H:%M").strftime('%Y-%m-%d %H:%M:%S')
                items.append({"name": name, "path": full_path, "is_dir": is_dir, "size": size, "modified": mod_date, "type": "Pasta" if is_dir else os.path.splitext(name)[1] or "Arquivo"})
    except (subprocess.CalledProcessError, Exception) as e:
        return {"error": str(e)}
    return items

def organize_directory(path: str, strategy_func):
    if os.path.exists(UNDO_LOG_FILE):
        os.remove(UNDO_LOG_FILE)
    
    files_moved = 0
    move_log = []
    try:
        temp_log = []
        for item_name in os.listdir(path):
            source_path = os.path.join(path, item_name)
            if os.path.isdir(source_path): continue
            destination_path = strategy_func(path, item_name, source_path)
            if destination_path:
                temp_log.append({'source': source_path, 'destination': destination_path})
        
        for move in temp_log:
            destination_folder = os.path.dirname(move['destination'])
            if not os.path.exists(destination_folder):
                os.makedirs(destination_folder)
            shutil.move(move['source'], move['destination'])
            move_log.append(move)
            files_moved += 1
    except Exception as e:
        undo_organization()
        return {"error": str(e)}

    with open(UNDO_LOG_FILE, 'w') as f:
        json.dump(move_log, f)
        
    return {"status": "sucesso", "files_moved": files_moved}

def strategy_by_type(path, item_name, source_path):
    extension = os.path.splitext(item_name)[1].lower()
    target_folder_name = EXTENSION_MAP.get(extension, 'Outros')
    return os.path.join(path, target_folder_name, item_name)

def strategy_by_date(path, item_name, source_path):
    mod_time = os.path.getmtime(source_path)
    date = datetime.fromtimestamp(mod_time)
    year = date.strftime('%Y')
    month = date.strftime('%m-%B').capitalize()
    destination_folder = os.path.join(path, year, month)
    return os.path.join(destination_folder, item_name)

def delete_files(paths: list):
    deleted_count = 0
    errors = []
    for path in paths:
        try:
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
            filename = os.path.basename(path)
            destination_name = f"{os.path.splitext(filename)[0]}_{timestamp}{os.path.splitext(filename)[1]}"
            destination_path = os.path.join(RECYCLE_BIN_PATH, destination_name)
            shutil.move(path, destination_path)
            deleted_count += 1
        except Exception as e:
            errors.append(f"Falha ao mover {path} para a lixeira: {str(e)}")
    return {"status": "sucesso", "deleted_count": deleted_count, "errors": errors}

def undo_organization():
    try:
        with open(UNDO_LOG_FILE, 'r') as f:
            log = json.load(f)
        for move in reversed(log):
            try:
                source_folder = os.path.dirname(move['source'])
                if not os.path.exists(source_folder):
                    os.makedirs(source_folder)
                shutil.move(move['destination'], move['source'])
            except Exception as e:
                print(f"Erro ao tentar desfazer a movimentação de {move['destination']}: {e}")
        os.remove(UNDO_LOG_FILE)
    except FileNotFoundError:
        print("Arquivo de log para desfazer não encontrado.")
        raise
    except Exception as e:
        print(f"Ocorreu um erro ao desfazer: {e}")
        raise

def get_file_details(path: str):
    try:
        stats = os.stat(path)
        hasher = hashlib.md5()
        with open(path, 'rb') as f:
            for byte_block in iter(lambda: f.read(65536), b""):
                hasher.update(byte_block)
        return {"path": path, "size": stats.st_size, "created": datetime.fromtimestamp(stats.st_ctime).strftime('%Y-%m-%d %H:%M:%S'),"modified": datetime.fromtimestamp(stats.st_mtime).strftime('%Y-%m-%d %H:%M:%S'),"accessed": datetime.fromtimestamp(stats.st_atime).strftime('%Y-%m-%d %H:%M:%S'), "hash": hasher.hexdigest()}
    except Exception as e:
        return {"error": str(e)}

def find_duplicate_files(path: str):
    files_by_size = {}
    for dirpath, _, filenames in os.walk(path):
        for filename in filenames:
            full_path = os.path.join(dirpath, filename)
            try:
                size = os.path.getsize(full_path)
                if size > 1024:
                    if size in files_by_size:
                        files_by_size[size].append(full_path)
                    else:
                        files_by_size[size] = [full_path]
            except (OSError, FileNotFoundError):
                continue
    files_by_hash = {}
    for size_group in files_by_size.values():
        if len(size_group) < 2: continue
        for file_path in size_group:
            try:
                hasher = hashlib.md5()
                with open(file_path, 'rb') as f:
                    for byte_block in iter(lambda: f.read(65536), b""):
                        hasher.update(byte_block)
                file_hash = hasher.hexdigest()
                if file_hash in files_by_hash:
                    files_by_hash[file_hash].append(file_path)
                else:
                    files_by_hash[file_hash] = [file_path]
            except (OSError, FileNotFoundError):
                continue
    duplicates = [group for group in files_by_hash.values() if len(group) > 1]
    return {"status": "sucesso", "duplicates": duplicates}