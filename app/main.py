import os
from typing import Optional
from dotenv import load_dotenv

# Carrega a chave de API do .env
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.themes import THEMES
from app.gemini_analyzer import analyze_essay, EssayAnalysisResult, DEFAULT_API_KEY

app = FastAPI(
    title="Redação ENEM • Sophie",
    description="Plataforma de treino e correção de redação do ENEM para a Sophie."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextAnalysisRequest(BaseModel):
    text: str
    theme: Optional[str] = None
    api_key: Optional[str] = None

class KeyTestRequest(BaseModel):
    api_key: Optional[str] = None

@app.get("/api/themes")
def get_themes():
    return {"themes": THEMES}

@app.post("/api/test-key")
def test_key(req: KeyTestRequest):
    key = (req.api_key or "").strip() or os.environ.get("GEMINI_API_KEY") or DEFAULT_API_KEY
    try:
        from google import genai
        client = genai.Client(api_key=key)
        
        last_err = None
        for m in ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.7-flash"]:
            try:
                resp = client.models.generate_content(
                    model=m,
                    contents="Diga 'Conexão ativa com sucesso!' em 4 palavras."
                )
                return {"success": True, "message": f"Chave API conectada com sucesso ({m})!", "sample": resp.text.strip()}
            except Exception as e:
                last_err = e
        raise last_err or RuntimeError("Falha nos modelos.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao validar chave com a Google: {str(e)}")

@app.post("/api/analyze/text", response_model=EssayAnalysisResult)
def analyze_text(req: TextAnalysisRequest):
    if not req.text or len(req.text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Por favor, escreva um texto com pelo menos 20 caracteres para análise.")
    
    return analyze_essay(
        text=req.text.strip(),
        theme=req.theme,
        api_key=req.api_key
    )

@app.post("/api/analyze/image", response_model=EssayAnalysisResult)
async def analyze_image(
    file: UploadFile = File(...),
    theme: Optional[str] = Form(None),
    api_key: Optional[str] = Form(None)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="O arquivo enviado precisa ser uma imagem válida (JPG, PNG, WEBP).")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Arquivo de imagem vazio.")

    return analyze_essay(
        image_bytes=contents,
        image_mime=file.content_type,
        theme=theme,
        api_key=api_key
    )

# Static files mount
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(static_dir, "index.html"))

@app.get("/favicon.ico")
def serve_favicon():
    return FileResponse(os.path.join(static_dir, "favicon.svg"), media_type="image/svg+xml")
