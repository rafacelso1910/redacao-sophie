import os
import random
from typing import Optional
from dotenv import load_dotenv

# Carrega a chave de API do .env
load_dotenv()

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.themes import THEMES
from app.gemini_analyzer import analyze_essay, EssayAnalysisResult, DEFAULT_API_KEY

app = FastAPI(
    title="Stairway to 1000 • Redação ENEM - Para Sophie ⚡",
    description="Plataforma de redação feita por Rafael para Sophie."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Recados do Rafael para a Sophie (fofos, charmosos, com carinho, rock e incentivo)
ROCK_NOTES = [
    {
        "quote": "Como a Alice Oseman escreveu em Heartstopper: você não precisa ter todas as respostas do mundo agora, só precisa dar um passo de cada vez. 🍂❤️\n\nRespira fundo antes de começar a introdução, você é brilhante e tem um futuro lindo pela frente! Domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️",
        "band": "Alice Oseman (Heartstopper) • Rafa 🍂",
        "author": "Rafael"
    },
    {
        "quote": "'Hi.' 'Hi.' ✨ Na pegada fofa de Nick e Charlie: tô aqui torcendo por você em cada parágrafo!\n\nQuando bater aquele cansaço dos estudos, lembra que o seu esforço vai valer cada segundo. Você é maravilhosa, Sophie! Domingo que vem te vejo com certeza! 😉❤️",
        "band": "Heartstopper • Rafa 🍂❤️",
        "author": "Rafael"
    },
    {
        "quote": "Como diz a Alice Oseman em Radio Silence: 'Eu me pergunto se, quando ninguém está ouvindo a sua voz, você ainda está fazendo algum som'... 🎧🍂\n\nQuero que você saiba que eu tô sempre aqui te ouvindo e torcendo por você! Sua escrita tem muita sensibilidade e força. Domingo que vem te vejo pra te desejar boa sorte pessoalmente! 😉❤️",
        "band": "Alice Oseman (Radio Silence) • Rafa 🍂",
        "author": "Rafael"
    },
    {
        "quote": "Dica de ouro no estilo Alice Oseman: escreva com verdade e coloque a sua essência nos argumentos. 📖✨\n\nVocê não precisa fingir nada: a sua inteligência e seu olhar crítico já são mais que suficientes pra encantar qualquer corretor do ENEM. Domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️",
        "band": "Alice Oseman • Rafa 🍂",
        "author": "Rafael"
    },
    {
        "quote": "Mais uma da Alice Oseman em Solitaire: 'Coisas boas podem acontecer, mesmo quando tudo parece meio caótico'. 🍂❤️\n\nConfia no processo e vai com calma. Você é muito esforçada e dedicada, Sophie. Domingo a gente se vê sem falta! 😉❤️",
        "band": "Alice Oseman (Solitaire) • Rafa 🍂",
        "author": "Rafael"
    },
    {
        "quote": "Desculpa por não conseguir te ver hoje, gatinha... Mas domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️\n\nFiz esse site com o maior carinho pra você treinar no ônibus, em casa ou onde estiver com praticidade. Você é linda, super inteligente e esforçada, tenho certeza de que vai gabaritar essa redação! Foco total no treino! ❤️⚡",
        "band": "Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Desculpa por não conseguir te ver hoje, domingo que vem eu te vejo e te dou aquele beijo de boa sorte! 😉❤️\n\nE como diria o Queen: 'Don't Stop Me Now'! Foca na estrutura dos parágrafos e nos conectivos que essa nota 1000 já tem dona. Tô na torcida por você, gatinha! ❤️",
        "band": "Queen • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "David Bowie mandou avisar: 'We can be heroes, just for one day'! ⚡\n\nVocê é muito inteligente e tem uma visão crítica incrível. Quando pegar o tema, respira fundo e confia no seu repertório. Domingo que vem te vejo pra comemorar sua evolução! 😉❤️",
        "band": "David Bowie • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Lembra do Paul McCartney: 'Take a sad song and make it better'! 🎸\n\nSe bater aquela dúvida na hora da tese, não esquenta: revisa o projeto de texto e vai no seu ritmo. Você é brilhante demais, Sophie! Domingo que vem te dou aquele beijo de boa sorte pessoalmente! 😉❤️",
        "band": "The Beatles • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Na pegada cósmica de Vênere Vai Vênus: boas energias pra te dar muita sorte hoje! 🪐❤️\n\nDomingo que vem eu te vejo com certeza pra te desejar boa sorte pessoalmente. Espero que você goste bastante do site, fiz pensando em você pra facilitar sua rotina e te ver brilhando na faculdade! ❤️",
        "band": "Vênere Vai Vênus • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Led Zeppelin já profetizou: 'There's a lady who's sure all that glitters is gold... and she's buying a Stairway to Heaven' ⚡\n\nNo nosso caso é a Stairway to 1000! Cada treino seu é um degrau a mais rumo à aprovação. Domingo que vem te vejo sem falta! 😉❤️",
        "band": "Led Zeppelin • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Como diria o Oasis em 'Wonderwall': 'Because maybe, you're gonna be the one that saves me'! 🎸✨\n\nNão deixa a ansiedade te pegar, gatinha. Você escreve muito bem e tem repertório de sobra. Domingo a gente se vê pra colocar o papo em dia e te dou um beijo de boa sorte pessoalmente! 😉❤️",
        "band": "Oasis • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Dica de ouro do Rafa: capricha nos 5 elementos da proposta de intervenção na C5! 📝\n\nAgente, ação, meio/modo, efeito e detalhamento. Não tem segredo pra quem é inteligente e dedicada como você. Tô muito orgulhoso do seu foco! Domingo que vem eu te vejo! 😉❤️",
        "band": "Dica do Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Freddie Mercury cantou: 'We Are The Champions'! 👑⚡\n\nE você já é campeã só pela dedicação de treinar redação até nos dias mais corridos. Você é uma garota incrível, Sophie. Domingo que vem te vejo! 😉❤️",
        "band": "Queen • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "John Lennon dizia: 'Imagine all the people living life in peace'... 🕊️\n\nE eu fico imaginando a sua nota 1000 saindo no boletim do ENEM! Certeza de que a sua vaga tá garantida. Respira, toma uma água e bora pro próximo parágrafo! Te vejo domingo! 😉❤️",
        "band": "John Lennon • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Lembra do Pink Floyd: 'Another Brick in the Wall'! 🧱⚡\n\nMas aqui cada parágrafo que você escreve é um tijolo construindo o seu futuro na universidade. Você é muito esforçada, Sophie, gosto muito de você e tô torcendo demais! Domingo te vejo! 😉❤️",
        "band": "Pink Floyd • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "The Rolling Stones mandaram avisar: 'Start Me Up'! 🎸🔥\n\nBora ligar o turbo nos conectivos e nas referências socioculturais! Você é genial, Sophie. Domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️",
        "band": "Rolling Stones • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Passando pra te lembrar: não se cobre perfeição em todo treino! ☕❤️\n\nO objetivo aqui é praticar sem pressão, no ônibus, em casa ou no intervalo. Fiz essa plataforma pra ser leve pra você. Você é sensacional, Sophie! Te vejo domingo! 😉❤️",
        "band": "Recado do Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Mais uma de Vênere Vai Vênus: 'A gravidade não segura quem nasceu pra voar'! 🪐✨\n\nConfia na sua caligrafia, no seu pensamento crítico e no seu talento. Domingo que vem te vejo sem falta, gatinha! 😉❤️",
        "band": "Vênere Vai Vênus • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Elton John já dizia: 'I'm Still Standing'! 🎹⚡\n\nMesmo quando bater o cansaço dos estudos, lembra que você tá mais perto do que imagina. Admiro muito sua força de vontade, Sophie! Te vejo domingo pra te dar aquele beijo de boa sorte pessoalmente! 😉❤️",
        "band": "Elton John • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Dica rápida de conectivos: 'Outrossim', 'Nesse diapasão', 'Sob essa ótica', 'Em consonância'... 📖\n\nUsa com elegância que a banca examinadora do ENEM vai aplaudir de pé! Domingo que vem eu te vejo, gatinha! 😉❤️",
        "band": "Dica do Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "The Who já cantava: 'The Kids Are Alright'! ⚡🎸\n\nE você tá mais que pronta pra detonar nessa prova. Fico feliz demais em poder te dar essa força. Domingo a gente se vê! 😉❤️",
        "band": "The Who • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "George Harrison mandou o recado: 'Here Comes The Sun, and I say it's all right'! ☀️🎸\n\nDepois de cada redação corrigida, vem o alívio e a evolução. Você é brilhante, Sophie! Domingo que vem te dou aquele beijo de boa sorte pessoalmente! 😉❤️",
        "band": "The Beatles • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Você sabia que a sua inteligência e seu jeito esforçado são contagiantes? ⚡❤️\n\nFiz esse cantinho pra você estudar com carinho. Arrebenta na argumentação que o resto é consequência! Domingo que vem te vejo! 😉❤️",
        "band": "Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Oasis em 'Live Forever': 'Maybe I will never be all the things that I want to be, but now is not the time to cry'... 🎸\n\nÉ tempo de brilhar no ENEM e mostrar todo esse seu potencial! Tô com você nessa jornada, gatinha. Te vejo domingo! 😉❤️",
        "band": "Oasis • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Dica da C2: lembra sempre de amarrar o repertório sociocultural com a tese! 💡\n\nNão adianta só citar o autor, tem que mostrar o porquê ele se conecta com a realidade brasileira. Mas você já sabe disso de letra! Domingo que vem te vejo! 😉❤️",
        "band": "Dica do Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "David Bowie em 'Starman': 'There's a starman waiting in the sky, he'd like to come and meet us'... 🌟⚡\n\nE a estrela dessa prova é você! Vai sem medo que o seu texto tá ficando cada dia mais afiado. Domingo que vem eu te vejo e te dou um beijo de boa sorte pessoalmente! 😉❤️",
        "band": "David Bowie • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Pausa estratégica: já bebeu água hoje? 💧 Já descansou os olhos 5 minutinhos?\n\nCuidar de você também faz parte da nota 1000! Você é muito especial, Sophie. Domingo a gente se vê! 😉❤️",
        "band": "Cuidado do Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Como diria Freddie Mercury: 'The Show Must Go On'! 👑⚡\n\nBora pra mais um parágrafo que a aprovação tá cada vez mais perto. Te admiro muito, Sophie! Te vejo domingo! 😉❤️",
        "band": "Queen • Rafa ⚡",
        "author": "Rafael"
    },
    {
        "quote": "Obrigado por me deixar fazer parte da sua preparação pro ENEM, mesmo que com um sitezinho e uma IA rodando! 💻❤️\n\nEspero que esteja te ajudando de verdade. Domingo que vem eu te vejo e te dou aquele beijo de boa sorte pessoalmente! 😉❤️",
        "band": "Rafa ⚡",
        "author": "Rafael"
    }
]

class TextAnalysisRequest(BaseModel):
    text: str
    theme: Optional[str] = None
    api_key: Optional[str] = None

class KeyTestRequest(BaseModel):
    api_key: Optional[str] = None

@app.get("/api/themes")
def get_themes():
    return {"themes": THEMES}

@app.get("/api/rock-note")
def get_random_rock_note():
    return random.choice(ROCK_NOTES)

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

