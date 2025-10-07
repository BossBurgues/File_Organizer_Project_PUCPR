from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os

from services.file_handler import (
    get_directory_contents, 
    organize_directory, 
    strategy_by_type, 
    strategy_by_date, 
    delete_files,
    get_file_details, 
    find_duplicate_files,
    undo_organization,
    UNDO_LOG_FILE
)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrganizeRequest(BaseModel):
    path: str
    strategy: str

class DeleteRequest(BaseModel):
    paths: List[str]

@app.get("/list-files")
def list_files_route(path: str):
    contents = get_directory_contents(path)
    if isinstance(contents, dict) and "error" in contents:
        raise HTTPException(status_code=400, detail=contents["error"])
    return contents

@app.get("/file-details")
def file_details_route(path: str):
    details = get_file_details(path)
    if isinstance(details, dict) and "error" in details:
        raise HTTPException(status_code=400, detail=details["error"])
    return details

@app.get("/find-duplicates")
def find_duplicates_route(path: str):
    result = find_duplicate_files(path)
    if isinstance(result, dict) and "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/organize-files")
def organize_files_route(request: OrganizeRequest):
    if request.strategy == 'by_type':
        result = organize_directory(request.path, strategy_by_type)
    elif request.strategy == 'by_date':
        result = organize_directory(request.path, strategy_by_date)
    else:
        raise HTTPException(status_code=400, detail="Estratégia de organização inválida.")
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/undo-last-organization")
def undo_last_organization_route():
    if not os.path.exists(UNDO_LOG_FILE):
        raise HTTPException(status_code=404, detail="Nenhuma operação para desfazer.")
    
    try:
        undo_organization()
        return {"status": "sucesso", "mensagem": "A última organização foi desfeita."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/delete-files")
def delete_files_route(request: DeleteRequest):
    result = delete_files(request.paths)
    return result